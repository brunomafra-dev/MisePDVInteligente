"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bike,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import {
  buildPizzaDeliveryName,
  calculatePizzaDeliveryPrice,
  deliveryCatalogSections,
  deliveryStore,
  deliveryZones,
  getDeliveryCatalogItem,
  getDeliveryZone,
  getPizzaSizeFromItemId,
  pizzaDeliveryFlavors,
  pizzaDeliverySizes,
  type DeliveryCatalogItem,
  type DeliveryCategoryId,
  type PizzaDeliverySizeId,
} from "./catalog";

type CartLine = {
  key: string;
  itemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  note?: string;
  pizza?: {
    sizeId: PizzaDeliverySizeId;
    flavorIds: string[];
  };
};

type CheckoutState = {
  name: string;
  phone: string;
  cpf: string;
  fulfillment: "delivery" | "pickup";
  neighborhoodId: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
  paymentMethod: "pix" | "cash" | "credit" | "debit";
  changeFor: string;
  whatsappOptIn: boolean;
  notes: string;
};

type OrderResult = {
  code: string;
  total: number;
  etaMin: number;
  etaMax: number;
  whatsappStatus: string;
  status: "pending_confirmation" | "new";
};

const initialCheckout: CheckoutState = {
  name: "",
  phone: "",
  cpf: "",
  fulfillment: "delivery",
  neighborhoodId: deliveryZones[0]?.id ?? "",
  street: "",
  number: "",
  complement: "",
  reference: "",
  paymentMethod: "pix",
  changeFor: "",
  whatsappOptIn: true,
  notes: "",
};

const paymentLabels: Record<CheckoutState["paymentMethod"], string> = {
  pix: "Pix",
  cash: "Dinheiro",
  credit: "Credito",
  debit: "Debito",
};

function cartQuantity(cart: CartLine[]) {
  return cart.reduce((sum, line) => sum + line.quantity, 0);
}

function cartSubtotal(cart: CartLine[]) {
  return cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

function generateKey(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function itemMatchesSearch(item: DeliveryCatalogItem, query: string) {
  const haystack = `${item.name} ${item.description ?? ""}`.toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function inputClassName(className?: string) {
  return cn(
    "h-12 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15",
    className,
  );
}

export function DeliverySite() {
  const [activeCategory, setActiveCategory] = useState<DeliveryCategoryId>("pizzas");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutState>(initialCheckout);
  const [pizzaDraft, setPizzaDraft] = useState<{
    itemId: string;
    sizeId: PizzaDeliverySizeId;
    flavorIds: string[];
    note: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;

    fetch("/api/delivery/pizza-e-cia/menu", { cache: "no-store" })
      .then((response) => response.json())
      .then((result: { availability?: Record<string, boolean> }) => {
        if (active) setAvailability(result.availability ?? {});
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const visibleSections = useMemo(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return deliveryCatalogSections.filter((section) => section.id === activeCategory);
    }

    return deliveryCatalogSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => itemMatchesSearch(item, trimmedQuery)),
      }))
      .filter((section) => section.items.length > 0);
  }, [activeCategory, query]);

  const selectedZone = getDeliveryZone(checkout.neighborhoodId);
  const deliveryFee = checkout.fulfillment === "delivery" ? selectedZone?.fee ?? 0 : 0;
  const subtotal = cartSubtotal(cart);
  const total = subtotal + deliveryFee;
  const etaMin =
    checkout.fulfillment === "delivery"
      ? selectedZone?.etaMin ?? deliveryStore.defaultEtaMin
      : 20;
  const etaMax =
    checkout.fulfillment === "delivery"
      ? selectedZone?.etaMax ?? deliveryStore.defaultEtaMax
      : 30;

  function addStandardItem(item: DeliveryCatalogItem) {
    if (availability[item.id] === false) return;

    setCart((current) => {
      const existing = current.find((line) => line.itemId === item.id && !line.pizza);

      if (existing) {
        return current.map((line) =>
          line.key === existing.key ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }

      return [
        ...current,
        {
          key: generateKey(item.id),
          itemId: item.id,
          name: item.name,
          unitPrice: item.price,
          quantity: 1,
        },
      ];
    });
  }

  function openItem(item: DeliveryCatalogItem) {
    if (availability[item.id] === false) return;

    const sizeId = getPizzaSizeFromItemId(item.id);

    if (!sizeId) {
      addStandardItem(item);
      return;
    }

    setPizzaDraft({
      itemId: item.id,
      sizeId,
      flavorIds: [pizzaDeliveryFlavors[0]?.id ?? "mussarela"],
      note: "",
    });
  }

  function updateLineQuantity(key: string, delta: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.key === key
            ? { ...line, quantity: Math.max(0, line.quantity + delta) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  function removeLine(key: string) {
    setCart((current) => current.filter((line) => line.key !== key));
  }

  function patchCheckout(patch: Partial<CheckoutState>) {
    setCheckout((current) => ({ ...current, ...patch }));
  }

  function togglePizzaFlavor(flavorId: string) {
    setPizzaDraft((current) => {
      if (!current) return current;

      const selected = current.flavorIds.includes(flavorId);
      const nextFlavorIds = selected
        ? current.flavorIds.length > 1
          ? current.flavorIds.filter((candidate) => candidate !== flavorId)
          : current.flavorIds
        : current.flavorIds.length < 2
          ? [...current.flavorIds, flavorId]
          : [current.flavorIds[1], flavorId];

      return { ...current, flavorIds: nextFlavorIds };
    });
  }

  function addPizzaDraft() {
    if (!pizzaDraft) return;

    const price = calculatePizzaDeliveryPrice(pizzaDraft.sizeId, pizzaDraft.flavorIds);
    const name = buildPizzaDeliveryName(pizzaDraft.sizeId, pizzaDraft.flavorIds);

    setCart((current) => [
      ...current,
      {
        key: generateKey(pizzaDraft.itemId),
        itemId: pizzaDraft.itemId,
        name,
        unitPrice: price,
        quantity: 1,
        note: pizzaDraft.note.trim() || undefined,
        pizza: {
          sizeId: pizzaDraft.sizeId,
          flavorIds: pizzaDraft.flavorIds,
        },
      },
    ]);
    setPizzaDraft(null);
    setCartOpen(true);
  }

  function validateCheckout() {
    if (cart.length === 0) return "Adicione pelo menos um item.";
    const unavailableLine = cart.find((line) => availability[line.itemId] === false);

    if (unavailableLine) return `${unavailableLine.name} esta indisponivel no momento.`;
    if (subtotal < deliveryStore.minOrder) {
      return `Pedido minimo de ${formatCurrency(deliveryStore.minOrder)}.`;
    }
    if (checkout.name.trim().length < 2) return "Informe seu nome.";
    if (checkout.phone.replace(/\D/g, "").length < 10) return "Informe um WhatsApp valido.";
    if (checkout.fulfillment === "delivery") {
      if (!checkout.neighborhoodId) return "Selecione o bairro.";
      if (checkout.street.trim().length < 2) return "Informe a rua.";
      if (checkout.number.trim().length < 1) return "Informe o numero.";
      if (!selectedZone) return "Bairro indisponivel.";
    }

    return "";
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const error = validateCheckout();

    if (error) {
      setFormError(error);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/delivery/pizza-e-cia/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((line) => ({
            itemId: line.itemId,
            quantity: line.quantity,
            note: line.note,
            pizza: line.pizza,
          })),
          customer: {
            name: checkout.name,
            phone: checkout.phone,
            cpf: checkout.cpf || undefined,
          },
          fulfillment: checkout.fulfillment,
          neighborhoodId: checkout.neighborhoodId,
          address: {
            street: checkout.street,
            number: checkout.number,
            complement: checkout.complement,
            reference: checkout.reference,
          },
          paymentMethod: checkout.paymentMethod,
          changeFor: checkout.changeFor ? Number(checkout.changeFor) : undefined,
          whatsappOptIn: checkout.whatsappOptIn,
          notes: checkout.notes,
        }),
      });
      const result = (await response.json().catch(() => null)) as
        | {
            order?: OrderResult;
            error?: string;
            message?: string;
          }
        | null;

      if (!response.ok || !result?.order) {
        throw new Error(result?.message ?? result?.error ?? "Nao foi possivel enviar o pedido.");
      }

      setOrderResult(result.order);
      setCart([]);
      setCartOpen(false);
    } catch (submitError) {
      setFormError(
        submitError instanceof Error
          ? submitError.message
          : "Nao foi possivel enviar o pedido.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (orderResult) {
    const message = encodeURIComponent(
      `Oi, fiz o pedido #${orderResult.code} pelo delivery proprio da ${deliveryStore.name}.`,
    );

    return (
      <main className="min-h-screen bg-[#fff7d6] text-[#24140d]">
        <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col px-4 py-6">
          <div className="rounded-lg border border-[#f3d66b] bg-white p-5 shadow-[0_24px_60px_-46px_rgba(91,27,18,0.5)]">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-md bg-[#0f7f3a] text-white">
                <Check className="size-6" />
              </span>
              <div>
                <p className="text-sm font-medium text-[#8b2d19]">Pedido enviado</p>
                <h1 className="text-2xl font-semibold">#{orderResult.code}</h1>
              </div>
            </div>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="rounded-md border border-[#f0dc90] bg-[#fff9e6] px-4 py-3">
                Status: <strong>Aguardando confirmacao do restaurante</strong>
              </div>
              <div className="rounded-md border border-[#f0dc90] bg-[#fff9e6] px-4 py-3">
                Total: <strong>{formatCurrency(orderResult.total)}</strong>
              </div>
              <div className="rounded-md border border-[#f0dc90] bg-[#fff9e6] px-4 py-3">
                Previsao apos confirmar:{" "}
                <strong>{orderResult.etaMin}-{orderResult.etaMax} min</strong>
              </div>
              <div className="rounded-md border border-[#f0dc90] bg-[#fff9e6] px-4 py-3">
                WhatsApp:{" "}
                <strong>
                  {orderResult.whatsappStatus === "queued" ? "aviso na fila" : "registrado"}
                </strong>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#0f7f3a] px-4 text-sm font-semibold text-white"
                href={`https://wa.me/${deliveryStore.whatsapp}?text=${message}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4" />
                Abrir WhatsApp
              </a>
              <Button
                className="h-12"
                variant="outline"
                onClick={() => {
                  setOrderResult(null);
                  setCheckout(initialCheckout);
                }}
              >
                Fazer outro pedido
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7d6] text-[#24140d]">
      <div className="mx-auto min-h-screen w-full max-w-[720px] bg-[#fffdf6] shadow-[0_0_80px_-58px_rgba(91,27,18,0.5)]">
        <header className="sticky top-0 z-30 border-b border-[#f0dc90] bg-[#fffdf6]/95 backdrop-blur">
          <div className="bg-[#d90416] px-4 py-2 text-xs font-semibold text-white">
            Delivery proprio {deliveryStore.phoneDisplay}
          </div>
          <div className="flex items-center gap-3 px-4 py-4">
            <Image
              alt={`Logo ${deliveryStore.name}`}
              src={deliveryStore.logoUrl}
              width={64}
              height={64}
              className="size-16 rounded-md border border-[#f0dc90] bg-white object-contain p-1"
              priority
            />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-semibold">{deliveryStore.name}</h1>
              <p className="truncate text-sm text-[#7a4a25]">{deliveryStore.brandLine}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge className="border-[#ffe58a] bg-[#fff1a8] text-[#78350f]">
                  <Clock3 className="mr-1 size-3" />
                  {deliveryStore.defaultEtaMin}-{deliveryStore.defaultEtaMax} min
                </Badge>
                <Badge className="border-[#b7f0c6] bg-[#e6ffed] text-[#166534]">
                  <MapPin className="mr-1 size-3" />
                  Amelia Rosa
                </Badge>
              </div>
            </div>
          </div>
          <div className="px-4 pb-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94633c]" />
              <input
                aria-label="Buscar no cardapio"
                className="h-11 w-full rounded-md border border-[#edd083] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#d90416] focus:ring-2 focus:ring-[#d90416]/15"
                placeholder="Buscar pizza, pastel, suco..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
            {deliveryCatalogSections.map((section) => (
              <button
                key={section.id}
                className={cn(
                  "h-10 shrink-0 rounded-md border px-3 text-sm font-medium transition",
                  activeCategory === section.id && !query.trim()
                    ? "border-[#d90416] bg-[#d90416] text-white"
                    : "border-[#edd083] bg-white text-[#6b3b1f]",
                )}
                onClick={() => {
                  setQuery("");
                  setActiveCategory(section.id);
                }}
                type="button"
              >
                {section.label}
              </button>
            ))}
          </nav>
        </header>

        <section className="px-4 py-4">
          <div className="rounded-lg border border-[#f0dc90] bg-[#fff2a8] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[#9a3412]">
                  Sem cadastro obrigatorio
                </p>
                <p className="mt-1 text-sm text-[#5f331e]">
                  Informe WhatsApp e endereco apenas na finalizacao.
                </p>
              </div>
              <Bike className="size-8 text-[#d90416]" />
            </div>
          </div>
        </section>

        <section className="grid gap-5 px-4 pb-32">
          {visibleSections.map((section) => (
            <div key={section.id} className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold">{section.label}</h2>
                <p className="text-sm text-[#7a4a25]">{section.subtitle}</p>
              </div>
              <div className="grid gap-3">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    className={cn(
                      "grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-[#f0dc90] bg-white p-4 text-left shadow-[0_18px_44px_-38px_rgba(91,27,18,0.42)] transition active:scale-[0.99]",
                      availability[item.id] === false && "bg-muted/40 opacity-65",
                    )}
                    disabled={availability[item.id] === false}
                    onClick={() => openItem(item)}
                    type="button"
                  >
                    <span className="min-w-0">
                      <span className="flex items-start justify-between gap-2">
                        <span className="font-semibold leading-tight">{item.name}</span>
                        <span
                          className={cn(
                            "shrink-0 text-sm font-semibold",
                            availability[item.id] === false
                              ? "text-[#8f8f8f]"
                              : "text-[#d90416]",
                          )}
                        >
                          {availability[item.id] === false
                            ? "Em falta"
                            : `${item.badge ? `${item.badge} ` : ""}${formatCurrency(item.price)}`}
                        </span>
                      </span>
                      {item.description ? (
                        <span className="mt-2 block text-sm leading-5 text-[#7a4a25]">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                    <span className="flex size-9 items-center justify-center rounded-md bg-[#d90416] text-white">
                      {item.kind === "pizza" ? (
                        <ChevronRight className="size-4" />
                      ) : (
                        <Plus className="size-4" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {visibleSections.length === 0 ? (
            <div className="rounded-lg border border-[#f0dc90] bg-white p-6 text-sm text-[#7a4a25]">
              Nenhum item encontrado.
            </div>
          ) : null}
        </section>

        {cart.length > 0 ? (
          <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[720px] border-t border-[#f0dc90] bg-white/96 px-4 py-3 backdrop-blur">
            <button
              className="flex h-14 w-full items-center justify-between rounded-md bg-[#0f7f3a] px-4 text-left text-white"
              onClick={() => setCartOpen(true)}
              type="button"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-md bg-white/15">
                  <ShoppingBag className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">
                    Ver sacola ({cartQuantity(cart)})
                  </span>
                  <span className="block text-xs text-white/80">
                    Entrega calculada no checkout
                  </span>
                </span>
              </span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </button>
          </div>
        ) : null}
      </div>

      {pizzaDraft ? (
        <PizzaSheet
          draft={pizzaDraft}
          onClose={() => setPizzaDraft(null)}
          onToggleFlavor={togglePizzaFlavor}
          onPatchNote={(note) =>
            setPizzaDraft((current) => (current ? { ...current, note } : current))
          }
          onSubmit={addPizzaDraft}
        />
      ) : null}

      {cartOpen ? (
        <CartSheet
          cart={cart}
          checkout={checkout}
          deliveryFee={deliveryFee}
          etaMax={etaMax}
          etaMin={etaMin}
          formError={formError}
          selectedZone={selectedZone}
          submitting={submitting}
          subtotal={subtotal}
          total={total}
          onClose={() => setCartOpen(false)}
          onPatchCheckout={patchCheckout}
          onRemove={removeLine}
          onSubmit={submitOrder}
          onUpdateQuantity={updateLineQuantity}
        />
      ) : null}
    </main>
  );
}

function PizzaSheet({
  draft,
  onClose,
  onToggleFlavor,
  onPatchNote,
  onSubmit,
}: {
  draft: {
    itemId: string;
    sizeId: PizzaDeliverySizeId;
    flavorIds: string[];
    note: string;
  };
  onClose: () => void;
  onToggleFlavor: (flavorId: string) => void;
  onPatchNote: (note: string) => void;
  onSubmit: () => void;
}) {
  const item = getDeliveryCatalogItem(draft.itemId);
  const price = calculatePizzaDeliveryPrice(draft.sizeId, draft.flavorIds);
  const groupedFlavors = ["tradicional", "doce", "especial", "premium"].map((group) => ({
    group,
    flavors: pizzaDeliveryFlavors.filter((flavor) => flavor.group === group),
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/45">
      <div className="max-h-[92vh] w-full overflow-hidden rounded-t-lg bg-[#fffdf6] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f0dc90] px-4 py-3">
          <button
            aria-label="Voltar"
            className="flex size-10 items-center justify-center rounded-md border border-[#f0dc90] bg-white"
            onClick={onClose}
            type="button"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="text-center">
            <p className="text-sm text-[#7a4a25]">{pizzaDeliverySizes[draft.sizeId].slices}</p>
            <h2 className="font-semibold">{item?.name ?? "Pizza"}</h2>
          </div>
          <span className="w-10" />
        </div>
        <div className="max-h-[calc(92vh-156px)] overflow-y-auto px-4 py-4">
          <div className="rounded-lg border border-[#f0dc90] bg-[#fff2a8] p-4">
            <p className="text-sm font-semibold">Escolha ate 2 sabores</p>
            <p className="mt-1 text-sm text-[#7a4a25]">
              O valor acompanha o sabor de maior preco.
            </p>
          </div>
          <div className="mt-4 grid gap-4">
            {groupedFlavors.map(({ group, flavors }) => (
              <div key={group} className="space-y-2">
                <p className="text-xs font-semibold uppercase text-[#9a3412]">
                  {group}
                </p>
                {flavors.map((flavor) => {
                  const selected = draft.flavorIds.includes(flavor.id);

                  return (
                    <button
                      key={flavor.id}
                      className={cn(
                        "w-full rounded-lg border bg-white p-3 text-left transition",
                        selected ? "border-[#d90416] ring-2 ring-[#d90416]/10" : "border-[#f0dc90]",
                      )}
                      onClick={() => onToggleFlavor(flavor.id)}
                      type="button"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="font-semibold">{flavor.name}</span>
                          <span className="mt-1 block text-sm leading-5 text-[#7a4a25]">
                            {flavor.description}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold text-[#d90416]">
                          {formatCurrency(flavor.prices[draft.sizeId])}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-medium">Observacao</span>
            <textarea
              className="mt-2 min-h-24 w-full rounded-md border border-[#f0dc90] bg-white p-3 text-sm outline-none focus:border-[#d90416] focus:ring-2 focus:ring-[#d90416]/15"
              maxLength={160}
              placeholder="Ex: sem cebola"
              value={draft.note}
              onChange={(event) => onPatchNote(event.target.value)}
            />
          </label>
        </div>
        <div className="border-t border-[#f0dc90] bg-white px-4 py-3">
          <Button className="h-12 w-full bg-[#d90416] hover:bg-[#b80312]" onClick={onSubmit}>
            Adicionar {formatCurrency(price)}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CartSheet({
  cart,
  checkout,
  deliveryFee,
  etaMax,
  etaMin,
  formError,
  selectedZone,
  submitting,
  subtotal,
  total,
  onClose,
  onPatchCheckout,
  onRemove,
  onSubmit,
  onUpdateQuantity,
}: {
  cart: CartLine[];
  checkout: CheckoutState;
  deliveryFee: number;
  etaMax: number;
  etaMin: number;
  formError: string;
  selectedZone?: { label: string; fee: number };
  submitting: boolean;
  subtotal: number;
  total: number;
  onClose: () => void;
  onPatchCheckout: (patch: Partial<CheckoutState>) => void;
  onRemove: (key: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateQuantity: (key: string, delta: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-end bg-black/45">
      <div className="max-h-[94vh] w-full overflow-hidden rounded-t-lg bg-[#fffdf6] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f0dc90] px-4 py-3">
          <div>
            <p className="text-sm text-[#7a4a25]">Sua sacola</p>
            <h2 className="text-lg font-semibold">{cartQuantity(cart)} item(ns)</h2>
          </div>
          <button
            aria-label="Fechar sacola"
            className="flex size-10 items-center justify-center rounded-md border border-[#f0dc90] bg-white"
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
        <form className="max-h-[calc(94vh-76px)] overflow-y-auto" onSubmit={onSubmit}>
          <div className="space-y-3 px-4 py-4">
            {cart.map((line) => (
              <div key={line.key} className="rounded-lg border border-[#f0dc90] bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold leading-tight">{line.name}</p>
                    {line.note ? (
                      <p className="mt-1 text-sm text-[#7a4a25]">{line.note}</p>
                    ) : null}
                    <p className="mt-2 text-sm font-semibold text-[#d90416]">
                      {formatCurrency(line.unitPrice)}
                    </p>
                  </div>
                  <button
                    aria-label={`Remover ${line.name}`}
                    className="flex size-9 items-center justify-center rounded-md border border-[#f0dc90]"
                    onClick={() => onRemove(line.key)}
                    type="button"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-[#f0dc90]">
                    <button
                      aria-label={`Diminuir ${line.name}`}
                      className="flex size-10 items-center justify-center"
                      onClick={() => onUpdateQuantity(line.key, -1)}
                      type="button"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">
                      {line.quantity}
                    </span>
                    <button
                      aria-label={`Aumentar ${line.name}`}
                      className="flex size-10 items-center justify-center"
                      onClick={() => onUpdateQuantity(line.key, 1)}
                      type="button"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(line.unitPrice * line.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#f0dc90] px-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                className={cn(
                  "h-11 rounded-md border text-sm font-semibold",
                  checkout.fulfillment === "delivery"
                    ? "border-[#0f7f3a] bg-[#0f7f3a] text-white"
                    : "border-[#f0dc90] bg-white",
                )}
                onClick={() => onPatchCheckout({ fulfillment: "delivery" })}
                type="button"
              >
                Entrega
              </button>
              <button
                className={cn(
                  "h-11 rounded-md border text-sm font-semibold",
                  checkout.fulfillment === "pickup"
                    ? "border-[#0f7f3a] bg-[#0f7f3a] text-white"
                    : "border-[#f0dc90] bg-white",
                )}
                onClick={() => onPatchCheckout({ fulfillment: "pickup" })}
                type="button"
              >
                Retirada
              </button>
            </div>
          </div>

          <div className="grid gap-3 border-t border-[#f0dc90] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <UserRound className="size-4 text-[#d90416]" />
              Dados do pedido
            </div>
            <input
              className={inputClassName()}
              maxLength={80}
              placeholder="Nome"
              value={checkout.name}
              onChange={(event) => onPatchCheckout({ name: event.target.value })}
            />
            <input
              className={inputClassName()}
              inputMode="tel"
              maxLength={20}
              placeholder="WhatsApp"
              value={checkout.phone}
              onChange={(event) => onPatchCheckout({ phone: event.target.value })}
            />
            <input
              className={inputClassName()}
              inputMode="numeric"
              maxLength={14}
              placeholder="CPF opcional"
              value={checkout.cpf}
              onChange={(event) => onPatchCheckout({ cpf: event.target.value })}
            />
          </div>

          {checkout.fulfillment === "delivery" ? (
            <div className="grid gap-3 border-t border-[#f0dc90] px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="size-4 text-[#d90416]" />
                Entrega
              </div>
              <select
                className={inputClassName()}
                value={checkout.neighborhoodId}
                onChange={(event) => onPatchCheckout({ neighborhoodId: event.target.value })}
              >
                {deliveryZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.label} - {formatCurrency(zone.fee)}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-[1fr_96px] gap-2">
                <input
                  className={inputClassName()}
                  maxLength={100}
                  placeholder="Rua"
                  value={checkout.street}
                  onChange={(event) => onPatchCheckout({ street: event.target.value })}
                />
                <input
                  className={inputClassName()}
                  maxLength={12}
                  placeholder="Numero"
                  value={checkout.number}
                  onChange={(event) => onPatchCheckout({ number: event.target.value })}
                />
              </div>
              <input
                className={inputClassName()}
                maxLength={80}
                placeholder="Complemento"
                value={checkout.complement}
                onChange={(event) => onPatchCheckout({ complement: event.target.value })}
              />
              <input
                className={inputClassName()}
                maxLength={120}
                placeholder="Referencia"
                value={checkout.reference}
                onChange={(event) => onPatchCheckout({ reference: event.target.value })}
              />
              <div className="rounded-md border border-[#f0dc90] bg-[#fff9e6] px-3 py-3 text-sm">
                {selectedZone?.label ?? "Bairro"}: {formatCurrency(deliveryFee)} | {etaMin}-
                {etaMax} min
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 border-t border-[#f0dc90] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CreditCard className="size-4 text-[#d90416]" />
              Pagamento
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(paymentLabels) as CheckoutState["paymentMethod"][]).map(
                (method) => (
                  <button
                    key={method}
                    className={cn(
                      "h-11 rounded-md border text-sm font-semibold",
                      checkout.paymentMethod === method
                        ? "border-[#d90416] bg-[#d90416] text-white"
                        : "border-[#f0dc90] bg-white",
                    )}
                    onClick={() => onPatchCheckout({ paymentMethod: method })}
                    type="button"
                  >
                    {paymentLabels[method]}
                  </button>
                ),
              )}
            </div>
            {checkout.paymentMethod === "cash" ? (
              <input
                className={inputClassName()}
                inputMode="decimal"
                placeholder="Troco para quanto?"
                value={checkout.changeFor}
                onChange={(event) => onPatchCheckout({ changeFor: event.target.value })}
              />
            ) : null}
            <textarea
              className="min-h-24 w-full rounded-md border border-[#f0dc90] bg-white p-3 text-sm outline-none focus:border-[#d90416] focus:ring-2 focus:ring-[#d90416]/15"
              maxLength={240}
              placeholder="Observacao do pedido"
              value={checkout.notes}
              onChange={(event) => onPatchCheckout({ notes: event.target.value })}
            />
            <label className="flex items-start gap-3 rounded-md border border-[#f0dc90] bg-white p-3 text-sm">
              <input
                checked={checkout.whatsappOptIn}
                className="mt-1"
                onChange={(event) =>
                  onPatchCheckout({ whatsappOptIn: event.target.checked })
                }
                type="checkbox"
              />
              <span>Receber confirmacao e aviso de entrega pelo WhatsApp.</span>
            </label>
          </div>

          <div className="sticky bottom-0 border-t border-[#f0dc90] bg-white px-4 py-4">
            {formError ? (
              <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            ) : null}
            <div className="mb-3 grid gap-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Entrega</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <Button
              className="h-12 w-full bg-[#0f7f3a] hover:bg-[#0b6930]"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Enviando..." : `Enviar pedido ${formatCurrency(total)}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
