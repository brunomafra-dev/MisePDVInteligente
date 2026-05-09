import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  buildPizzaDeliveryName,
  calculatePizzaDeliveryPrice,
  deliveryStore,
  getDeliveryCatalogItem,
  getDeliveryZone,
  getPizzaFlavor,
  getPizzaSizeFromItemId,
  normalizeDeliveryPhone,
  pizzaDeliverySizes,
  type PizzaDeliverySizeId,
} from "@/features/delivery-proprio/catalog";
import {
  assertDeliveryItemsAvailable,
  queryMust as must,
  resolveDeliveryUnit,
} from "@/features/delivery-proprio/server";
import {
  parseJsonPayload,
  PayloadError,
  payloadErrorResponse,
} from "@/lib/security/request";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import {
  moneyField,
  optionalTextField,
  quantityField,
  textField,
} from "@/lib/security/sanitize";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const technicalProductName = "Item delivery proprio";

const pizzaLineSchema = z.object({
  sizeId: z.enum(["brotinho", "grande"]),
  flavorIds: z.array(textField(60)).min(1).max(2),
});

const deliveryOrderSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            itemId: textField(80),
            quantity: quantityField(20).pipe(z.number().int().min(1).max(20)),
            note: optionalTextField(160),
            pizza: pizzaLineSchema.optional(),
          })
          .strict(),
      )
      .min(1)
      .max(60),
    customer: z
      .object({
        name: textField(80, 2),
        phone: textField(30, 8),
        cpf: optionalTextField(20),
      })
      .strict(),
    fulfillment: z.enum(["delivery", "pickup"]),
    neighborhoodId: optionalTextField(60),
    address: z
      .object({
        street: optionalTextField(100),
        number: optionalTextField(20),
        complement: optionalTextField(80),
        reference: optionalTextField(120),
      })
      .strict()
      .optional(),
    paymentMethod: z.enum(["pix", "cash", "credit", "debit"]),
    changeFor: moneyField(10_000).optional(),
    whatsappOptIn: z.boolean().default(true),
    notes: optionalTextField(240),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.fulfillment !== "delivery") return;

    if (!value.neighborhoodId || !getDeliveryZone(value.neighborhoodId)) {
      ctx.addIssue({
        code: "custom",
        path: ["neighborhoodId"],
        message: "Bairro indisponivel para entrega",
      });
    }
    if (!value.address?.street) {
      ctx.addIssue({
        code: "custom",
        path: ["address", "street"],
        message: "Rua obrigatoria",
      });
    }
    if (!value.address?.number) {
      ctx.addIssue({
        code: "custom",
        path: ["address", "number"],
        message: "Numero obrigatorio",
      });
    }
  });

type DeliveryOrderInput = z.infer<typeof deliveryOrderSchema>;

type SupabaseClient = ReturnType<typeof getSupabaseAdmin>;

type PricedLine = {
  productName: string;
  unitPrice: number;
  quantity: number;
  note?: string;
};

export const dynamic = "force-dynamic";

function responseIssue(message: string, status = 400) {
  return Response.json({ error: "delivery_order_error", message }, { status });
}

function phoneForDatabase(phone: string) {
  const normalized = normalizeDeliveryPhone(phone);

  return normalized.startsWith("+") ? normalized : `+${normalized}`;
}

function cpfDigits(cpf?: string) {
  const digits = cpf?.replace(/\D/g, "") ?? "";

  return digits.length > 0 ? digits : undefined;
}

function buildPricedLine(input: DeliveryOrderInput["items"][number]): PricedLine {
  const catalogItem = getDeliveryCatalogItem(input.itemId);

  if (!catalogItem) {
    throw new Error(`Item indisponivel: ${input.itemId}`);
  }

  if (catalogItem.kind === "pizza") {
    const sizeId = getPizzaSizeFromItemId(input.itemId);

    if (!sizeId || !input.pizza || input.pizza.sizeId !== sizeId) {
      throw new Error("Pizza invalida");
    }

    const flavors = input.pizza.flavorIds.map((flavorId) => getPizzaFlavor(flavorId));

    if (flavors.some((flavor) => !flavor)) {
      throw new Error("Sabor de pizza indisponivel");
    }

    const unitPrice = calculatePizzaDeliveryPrice(
      input.pizza.sizeId as PizzaDeliverySizeId,
      input.pizza.flavorIds,
    );
    const size = pizzaDeliverySizes[input.pizza.sizeId];
    const note = [size.slices, input.note].filter(Boolean).join(". ");

    return {
      productName: buildPizzaDeliveryName(input.pizza.sizeId, input.pizza.flavorIds),
      unitPrice,
      quantity: input.quantity,
      note: note || undefined,
    };
  }

  if (input.pizza) {
    throw new Error("Item comum nao aceita configuracao de pizza");
  }

  return {
    productName: catalogItem.name,
    unitPrice: catalogItem.price,
    quantity: input.quantity,
    note: input.note,
  };
}

async function getTechnicalProductId(client: SupabaseClient, unitId: string) {
  const existing = await must(
    "products",
    client
      .from("products")
      .select("id")
      .eq("unit_id", unitId)
      .eq("name", technicalProductName)
      .limit(1)
      .maybeSingle(),
  );

  if (existing && "id" in existing) {
    await must(
      "products technical update",
      client
        .from("products")
        .update({ active: false, category: "Sistema", preparation_area: "kitchen" })
        .eq("id", String(existing.id)),
    );

    return String(existing.id);
  }

  const inserted = await must(
    "products insert",
    client
      .from("products")
      .insert({
        id: randomUUID(),
        unit_id: unitId,
        name: technicalProductName,
        category: "Sistema",
        price: 0,
        active: false,
        preparation_area: "kitchen",
      })
      .select("id")
      .single(),
  );

  return String((inserted as { id: string }).id);
}

async function upsertCustomer(
  client: SupabaseClient,
  unitId: string,
  input: DeliveryOrderInput,
) {
  const phone = phoneForDatabase(input.customer.phone);
  const neighborhood =
    input.fulfillment === "delivery"
      ? getDeliveryZone(input.neighborhoodId ?? "")?.label
      : "Retirada";
  const existing = await must(
    "customers",
    client
      .from("customers")
      .select("id")
      .eq("unit_id", unitId)
      .eq("phone", phone)
      .limit(1)
      .maybeSingle(),
  );

  if (existing && "id" in existing) {
    await must(
      "customers update",
      client
        .from("customers")
        .update({ name: input.customer.name, neighborhood })
        .eq("id", String(existing.id)),
    );

    return String(existing.id);
  }

  const inserted = await must(
    "customers insert",
    client
      .from("customers")
      .insert({
        id: randomUUID(),
        unit_id: unitId,
        name: input.customer.name,
        phone,
        neighborhood,
      })
      .select("id")
      .single(),
  );

  return String((inserted as { id: string }).id);
}

async function nextOrderCode(client: SupabaseClient, unitId: string) {
  const rows = await must(
    "orders code",
    client.from("orders").select("code").eq("unit_id", unitId).limit(500),
  );
  const maxCode = Math.max(
    100,
    ...((rows as Array<{ code: string }> | null) ?? [])
      .map((row) => Number(row.code))
      .filter((code) => Number.isFinite(code)),
  );

  return String(maxCode + 1);
}

async function insertDeliveryDetail(
  client: SupabaseClient,
  orderId: string,
  input: DeliveryOrderInput,
  etaMin: number,
  etaMax: number,
) {
  const zone = getDeliveryZone(input.neighborhoodId ?? "");
  const { error } = await client.from("delivery_order_details").insert({
    id: randomUUID(),
    order_id: orderId,
    fulfillment: input.fulfillment,
    phone: phoneForDatabase(input.customer.phone),
    cpf: cpfDigits(input.customer.cpf),
    neighborhood: input.fulfillment === "delivery" ? zone?.label : "Retirada",
    street: input.fulfillment === "delivery" ? input.address?.street : null,
    number: input.fulfillment === "delivery" ? input.address?.number : null,
    complement: input.fulfillment === "delivery" ? input.address?.complement : null,
    reference: input.fulfillment === "delivery" ? input.address?.reference : null,
    payment_method: input.paymentMethod,
    change_for: input.paymentMethod === "cash" ? input.changeFor ?? null : null,
    whatsapp_opt_in: input.whatsappOptIn,
    eta_min: etaMin,
    eta_max: etaMax,
    source: "delivery_site",
  });

  if (error) {
    console.warn("Delivery detail not persisted", error.message);
  }
}

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, {
    scope: "delivery:pizza-e-cia:orders",
    limit: 30,
    windowMs: 60_000,
  });

  if (limited) return limited;

  let payload: unknown;

  try {
    payload = await parseJsonPayload(request, { maxBytes: 96 * 1024 });
  } catch (error) {
    if (error instanceof PayloadError) {
      return payloadErrorResponse(error);
    }

    throw error;
  }

  const parsed = deliveryOrderSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      { error: "invalid_payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let pricedLines: PricedLine[];

  try {
    pricedLines = parsed.data.items.map(buildPricedLine);
  } catch (error) {
    return responseIssue(error instanceof Error ? error.message : "Item invalido");
  }

  const subtotal = pricedLines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );

  if (subtotal < deliveryStore.minOrder) {
    return responseIssue(`Pedido minimo de R$${deliveryStore.minOrder.toFixed(2)}`);
  }

  const zone = getDeliveryZone(parsed.data.neighborhoodId ?? "");
  const deliveryFee = parsed.data.fulfillment === "delivery" ? zone?.fee ?? 0 : 0;
  const etaMin =
    parsed.data.fulfillment === "delivery"
      ? zone?.etaMin ?? deliveryStore.defaultEtaMin
      : 20;
  const etaMax =
    parsed.data.fulfillment === "delivery"
      ? zone?.etaMax ?? deliveryStore.defaultEtaMax
      : 30;
  const total = subtotal + deliveryFee;

  try {
    const client = getSupabaseAdmin();
    const unit = await resolveDeliveryUnit(client);
    await assertDeliveryItemsAvailable(
      client,
      unit.id,
      parsed.data.items.map((item) => item.itemId),
    );
    const [customerId, technicalProductId, code] = await Promise.all([
      upsertCustomer(client, unit.id, parsed.data),
      getTechnicalProductId(client, unit.id),
      nextOrderCode(client, unit.id),
    ]);
    const orderId = randomUUID();
    const openedAt = new Date().toISOString();
    const whatsappStatus = parsed.data.whatsappOptIn ? "queued" : "not_sent";

    await must(
      "orders insert",
      client.from("orders").insert({
        id: orderId,
        unit_id: unit.id,
        code,
        channel: "delivery",
        status: "pending_confirmation",
        table_id: null,
        customer_id: customerId,
        delivery_fee: deliveryFee,
        discount: 0,
        fiscal_status: "disabled",
        whatsapp_status: whatsappStatus,
        opened_at: openedAt,
      }),
    );

    await must(
      "order_items insert",
      client.from("order_items").insert(
        pricedLines.map((line) => ({
          id: randomUUID(),
          order_id: orderId,
          product_id: technicalProductId,
          quantity: line.quantity,
          custom_name: line.productName,
          unit_price: line.unitPrice,
          notes: [line.note, parsed.data.notes].filter(Boolean).join(" | ") || null,
        })),
      ),
    );

    await insertDeliveryDetail(client, orderId, parsed.data, etaMin, etaMax);

    return Response.json({
      ok: true,
      order: {
        id: orderId,
        code,
        subtotal,
        deliveryFee,
        total,
        etaMin,
        etaMax,
        status: "pending_confirmation",
        whatsappStatus,
      },
    });
  } catch (error) {
    console.error("Public delivery order failed", error);

    return responseIssue(
      error instanceof Error
        ? error.message
        : "Nao foi possivel registrar o pedido",
      500,
    );
  }
}
