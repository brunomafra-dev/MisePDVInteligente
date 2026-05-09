"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Home, MapPin, Plus, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { deliveryStore, deliveryZones, getDeliveryZone } from "./catalog";
import {
  emptyDeliveryAccount,
  emptyDeliveryAddress,
  readSavedAccount,
  writeSavedAccount,
  type DeliveryAddress,
  type DeliveryCustomerPaymentMethod,
  type SavedDeliveryAccount,
} from "./customer-storage";

const paymentLabels: Record<DeliveryCustomerPaymentMethod, string> = {
  pix: "Pix",
  cash: "Dinheiro",
  credit: "Credito",
  debit: "Debito",
};

function inputClassName(className?: string) {
  return cn(
    "h-12 w-full rounded-md border border-[#f0dc90] bg-white px-3 text-sm outline-none transition placeholder:text-[#9a6b45] focus:border-[#d90416] focus:ring-2 focus:ring-[#d90416]/15",
    className,
  );
}

function textareaClassName(className?: string) {
  return cn(
    "min-h-20 w-full rounded-md border border-[#f0dc90] bg-white p-3 text-sm outline-none transition placeholder:text-[#9a6b45] focus:border-[#d90416] focus:ring-2 focus:ring-[#d90416]/15",
    className,
  );
}

function createInitialAccount() {
  return readSavedAccount() ?? emptyDeliveryAccount();
}

function cleanPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function addressIsReady(address: DeliveryAddress) {
  return (
    address.label.trim().length >= 2 &&
    address.neighborhoodId.trim().length > 0 &&
    address.street.trim().length >= 2 &&
    address.number.trim().length >= 1
  );
}

export function DeliveryAccountPage() {
  const [account, setAccount] = useState<SavedDeliveryAccount>(createInitialAccount);
  const [addressDraft, setAddressDraft] = useState<DeliveryAddress>(() =>
    emptyDeliveryAddress(),
  );
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const defaultAddress = useMemo(
    () =>
      account.addresses.find((address) => address.id === account.defaultAddressId) ??
      account.addresses[0] ??
      null,
    [account.addresses, account.defaultAddressId],
  );

  const addressZone = getDeliveryZone(addressDraft.neighborhoodId);

  function patchAccount(patch: Partial<SavedDeliveryAccount>) {
    setSaved(false);
    setAccount((current) => ({ ...current, ...patch }));
  }

  function patchAddress(patch: Partial<DeliveryAddress>) {
    setSaved(false);
    setAddressDraft((current) => ({ ...current, ...patch }));
  }

  function resetAddressForm() {
    setEditingAddressId(null);
    setAddressDraft(emptyDeliveryAddress());
  }

  function addOrUpdateAddress() {
    setError("");

    if (!addressIsReady(addressDraft)) {
      setError("Preencha apelido, bairro, rua e numero do endereco.");
      return;
    }

    setAccount((current) => {
      const nextAddress = {
        ...addressDraft,
        label: addressDraft.label.trim(),
        street: addressDraft.street.trim(),
        number: addressDraft.number.trim(),
        complement: addressDraft.complement.trim(),
        reference: addressDraft.reference.trim(),
      };
      const exists = current.addresses.some((address) => address.id === nextAddress.id);
      const addresses = exists
        ? current.addresses.map((address) =>
            address.id === nextAddress.id ? nextAddress : address,
          )
        : [...current.addresses, nextAddress];

      return {
        ...current,
        defaultAddressId: current.defaultAddressId || nextAddress.id,
        addresses,
      };
    });

    resetAddressForm();
  }

  function editAddress(address: DeliveryAddress) {
    setError("");
    setSaved(false);
    setEditingAddressId(address.id);
    setAddressDraft({ ...address });
  }

  function removeAddress(addressId: string) {
    setSaved(false);
    setAccount((current) => {
      const addresses = current.addresses.filter((address) => address.id !== addressId);

      return {
        ...current,
        addresses,
        defaultAddressId:
          current.defaultAddressId === addressId
            ? addresses[0]?.id ?? ""
            : current.defaultAddressId,
      };
    });

    if (editingAddressId === addressId) resetAddressForm();
  }

  function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);

    if (account.name.trim().length < 2) {
      setError("Informe seu nome.");
      return;
    }

    if (cleanPhone(account.phone).length < 10) {
      setError("Informe um WhatsApp valido.");
      return;
    }

    if (account.addresses.length === 0) {
      setError("Adicione pelo menos um endereco de entrega.");
      return;
    }

    const nextAccount = {
      ...account,
      name: account.name.trim(),
      phone: account.phone.trim(),
      cpf: account.cpf.trim(),
      defaultAddressId: account.defaultAddressId || account.addresses[0]?.id || "",
      updatedAt: new Date().toISOString(),
    };

    writeSavedAccount(nextAccount);
    setAccount(nextAccount);
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-[#fff7d6] text-[#24140d]">
      <div className="mx-auto min-h-screen w-full max-w-[720px] bg-[#fffdf6] shadow-[0_0_80px_-58px_rgba(91,27,18,0.5)]">
        <header className="sticky top-0 z-30 border-b border-[#f0dc90] bg-[#fffdf6]/95 backdrop-blur">
          <div className="bg-[#d90416] px-4 py-2 text-xs font-semibold text-white">
            <div className="flex items-center justify-between gap-3">
              <span>Cadastro do delivery</span>
              <Link
                className="rounded-md bg-white/15 px-2 py-1 text-[11px] font-semibold"
                href={`/delivery/${deliveryStore.slug}`}
              >
                Cardapio
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-4">
            <Link
              aria-label="Voltar para o cardapio"
              className="flex size-11 shrink-0 items-center justify-center rounded-md border border-[#f0dc90] bg-white"
              href={`/delivery/${deliveryStore.slug}`}
            >
              <ArrowLeft className="size-4" />
            </Link>
            <Image
              alt={`Logo ${deliveryStore.name}`}
              src={deliveryStore.logoUrl}
              width={52}
              height={52}
              className="size-[52px] rounded-md border border-[#f0dc90] bg-white object-contain p-1"
              priority
            />
            <div className="min-w-0">
              <p className="truncate text-sm text-[#7a4a25]">{deliveryStore.name}</p>
              <h1 className="truncate text-xl font-semibold">Login e cadastro</h1>
            </div>
          </div>
        </header>

        <form className="px-4 pb-28 pt-4" onSubmit={saveAccount}>
          {saved ? (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-[#b7f0c6] bg-[#e6ffed] p-4 text-sm text-[#14532d]">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              Cadastro salvo neste aparelho. No proximo pedido o checkout puxa seus dados.
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <section className="rounded-lg border border-[#f0dc90] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#d90416]">Seus dados</p>
                <h2 className="mt-1 text-lg font-semibold">Pedido mais rapido</h2>
              </div>
              <Badge className="border-[#ffe58a] bg-[#fff1a8] text-[#78350f]">
                Local
              </Badge>
            </div>
            <div className="mt-4 grid gap-3">
              <input
                className={inputClassName()}
                maxLength={80}
                placeholder="Nome"
                value={account.name}
                onChange={(event) => patchAccount({ name: event.target.value })}
              />
              <input
                className={inputClassName()}
                inputMode="tel"
                maxLength={20}
                placeholder="WhatsApp"
                value={account.phone}
                onChange={(event) => patchAccount({ phone: event.target.value })}
              />
              <input
                className={inputClassName()}
                inputMode="numeric"
                maxLength={14}
                placeholder="CPF opcional"
                value={account.cpf}
                onChange={(event) => patchAccount({ cpf: event.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(paymentLabels) as DeliveryCustomerPaymentMethod[]).map(
                  (method) => (
                    <button
                      key={method}
                      className={cn(
                        "h-11 rounded-md border text-sm font-semibold",
                        account.paymentMethod === method
                          ? "border-[#d90416] bg-[#d90416] text-white"
                          : "border-[#f0dc90] bg-white",
                      )}
                      onClick={() => patchAccount({ paymentMethod: method })}
                      type="button"
                    >
                      {paymentLabels[method]}
                    </button>
                  ),
                )}
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-lg border border-[#f0dc90] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#d90416]">Enderecos</p>
                <h2 className="mt-1 text-lg font-semibold">Locais de entrega</h2>
              </div>
              <MapPin className="size-5 text-[#d90416]" />
            </div>

            <div className="mt-4 grid gap-3">
              {account.addresses.length === 0 ? (
                <div className="rounded-md border border-dashed border-[#f0dc90] bg-[#fff9e6] p-4 text-sm text-[#7a4a25]">
                  Cadastre casa, trabalho ou outro endereco usado com frequencia.
                </div>
              ) : null}

              {account.addresses.map((address) => {
                const zone = getDeliveryZone(address.neighborhoodId);
                const isDefault = defaultAddress?.id === address.id;

                return (
                  <article
                    key={address.id}
                    className={cn(
                      "rounded-lg border p-3",
                      isDefault ? "border-[#0f7f3a] bg-[#e6ffed]" : "border-[#f0dc90]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Home className="size-4 text-[#d90416]" />
                          <h3 className="font-semibold">{address.label}</h3>
                          {isDefault ? (
                            <span className="rounded-md bg-[#0f7f3a] px-2 py-0.5 text-[11px] font-semibold text-white">
                              Padrao
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm text-[#5f331e]">
                          {address.street}, {address.number}
                          {address.complement ? ` - ${address.complement}` : ""}
                        </p>
                        <p className="mt-1 text-sm text-[#7a4a25]">
                          {zone?.label ?? "Bairro"} | entrega {formatCurrency(zone?.fee ?? 0)}
                        </p>
                      </div>
                      <button
                        aria-label={`Remover ${address.label}`}
                        className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[#f0dc90] bg-white"
                        onClick={() => removeAddress(address.id)}
                        type="button"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button
                        className="h-10"
                        onClick={() => editAddress(address)}
                        type="button"
                        variant="outline"
                      >
                        Editar
                      </Button>
                      <Button
                        className="h-10"
                        disabled={isDefault}
                        onClick={() => patchAccount({ defaultAddressId: address.id })}
                        type="button"
                        variant="outline"
                      >
                        Usar
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-4 rounded-lg border border-[#f0dc90] bg-[#fff9e6] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#d90416]">
                  {editingAddressId ? "Editar endereco" : "Novo endereco"}
                </p>
                <h2 className="mt-1 text-lg font-semibold">
                  {editingAddressId ? addressDraft.label : "Adicionar local"}
                </h2>
              </div>
              {editingAddressId ? (
                <Button className="h-9" onClick={resetAddressForm} type="button" variant="outline">
                  Cancelar
                </Button>
              ) : null}
            </div>

            <div className="mt-4 grid gap-3">
              <input
                className={inputClassName()}
                maxLength={40}
                placeholder="Apelido. Ex: Casa, trabalho"
                value={addressDraft.label}
                onChange={(event) => patchAddress({ label: event.target.value })}
              />
              <select
                className={inputClassName()}
                value={addressDraft.neighborhoodId}
                onChange={(event) => patchAddress({ neighborhoodId: event.target.value })}
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
                  value={addressDraft.street}
                  onChange={(event) => patchAddress({ street: event.target.value })}
                />
                <input
                  className={inputClassName()}
                  maxLength={12}
                  placeholder="Numero"
                  value={addressDraft.number}
                  onChange={(event) => patchAddress({ number: event.target.value })}
                />
              </div>
              <input
                className={inputClassName()}
                maxLength={80}
                placeholder="Complemento"
                value={addressDraft.complement}
                onChange={(event) => patchAddress({ complement: event.target.value })}
              />
              <textarea
                className={textareaClassName()}
                maxLength={120}
                placeholder="Referencia para o entregador"
                value={addressDraft.reference}
                onChange={(event) => patchAddress({ reference: event.target.value })}
              />
              <div className="rounded-md border border-[#f0dc90] bg-white px-3 py-3 text-sm text-[#5f331e]">
                {addressZone?.label ?? "Bairro"}: {formatCurrency(addressZone?.fee ?? 0)} |
                prazo estimado {addressZone?.etaMin ?? deliveryStore.defaultEtaMin}-
                {addressZone?.etaMax ?? deliveryStore.defaultEtaMax} min
              </div>
              <Button
                className="h-12 bg-[#d90416] hover:bg-[#b80312]"
                onClick={addOrUpdateAddress}
                type="button"
              >
                <Plus className="mr-2 size-4" />
                {editingAddressId ? "Salvar endereco" : "Adicionar endereco"}
              </Button>
            </div>
          </section>

          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#f0dc90] bg-white px-4 py-3">
            <div className="mx-auto flex w-full max-w-[720px] gap-2">
              <Link
                className="inline-flex h-12 flex-1 items-center justify-center rounded-md border border-[#f0dc90] bg-white text-sm font-semibold"
                href={`/delivery/${deliveryStore.slug}`}
              >
                Voltar
              </Link>
              <Button className="h-12 flex-[1.4] bg-[#0f7f3a] hover:bg-[#0b6930]" type="submit">
                <Save className="mr-2 size-4" />
                Salvar cadastro
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
