import { z } from "zod";
import { normalizeDeliveryPhone } from "@/features/delivery-proprio/catalog";
import { queryMust as must } from "@/features/delivery-proprio/server";
import {
  parseJsonPayload,
  PayloadError,
  payloadErrorResponse,
} from "@/lib/security/request";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { textField } from "@/lib/security/sanitize";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const lookupSchema = z.object({
  orders: z
    .array(
      z.object({
        id: z.string().uuid(),
        phone: textField(30, 8),
      }),
    )
    .min(1)
    .max(20),
});

const publicStatusLabel: Record<OrderStatus, string> = {
  pending_confirmation: "Aguardando confirmacao do restaurante",
  new: "Confirmado pelo restaurante",
  preparing: "Em preparo",
  ready: "Pronto",
  delivered: "Saiu para entrega",
  paid: "Finalizado",
  cancelled: "Cancelado",
};

function normalizedPhone(value: string) {
  const phone = normalizeDeliveryPhone(value);

  return phone.startsWith("+") ? phone : `+${phone}`;
}

function numberValue(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);

  return 0;
}

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, {
    scope: "delivery:pizza-e-cia:orders:lookup",
    limit: 60,
    windowMs: 60_000,
  });

  if (limited) return limited;

  let payload: unknown;

  try {
    payload = await parseJsonPayload(request, { maxBytes: 32 * 1024 });
  } catch (error) {
    if (error instanceof PayloadError) {
      return payloadErrorResponse(error);
    }

    throw error;
  }

  const parsed = lookupSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      { error: "invalid_payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const client = getSupabaseAdmin();
    const ids = parsed.data.orders.map((order) => order.id);
    const expectedPhoneByOrder = Object.fromEntries(
      parsed.data.orders.map((order) => [order.id, normalizedPhone(order.phone)]),
    );
    const orders = (await must(
      "orders lookup",
      client
        .from("orders")
        .select("id, code, status, delivery_fee, discount, opened_at, customer_id")
        .eq("channel", "delivery")
        .in("id", ids),
    )) as Array<{
      id: string;
      code: string;
      status: OrderStatus;
      delivery_fee: number | string;
      discount: number | string;
      opened_at: string;
      customer_id: string | null;
    }>;
    const orderIds = orders.map((order) => order.id);
    const customerIds = orders
      .map((order) => order.customer_id)
      .filter((id): id is string => Boolean(id));
    const [itemsResult, customersResult, detailsResult] = await Promise.all([
      must(
        "order_items lookup",
        client
          .from("order_items")
          .select("order_id, quantity, custom_name, unit_price")
          .in("order_id", orderIds),
      ),
      customerIds.length > 0
        ? must(
            "customers lookup",
            client.from("customers").select("id, phone").in("id", customerIds),
          )
        : Promise.resolve([]),
      client
        .from("delivery_order_details")
        .select("order_id, phone, eta_min, eta_max")
        .in("order_id", orderIds),
    ]);
    const items = itemsResult as Array<{
      order_id: string;
      quantity: number | string;
      custom_name: string | null;
      unit_price: number | string | null;
    }>;
    const customersById = Object.fromEntries(
      (customersResult as Array<{ id: string; phone: string }>).map((customer) => [
        customer.id,
        normalizedPhone(customer.phone),
      ]),
    );
    const details = detailsResult.error
      ? []
      : ((detailsResult.data ?? []) as Array<{
          order_id: string;
          phone: string;
          eta_min: number | string | null;
          eta_max: number | string | null;
        }>);
    const detailsByOrder = Object.fromEntries(
      details.map((detail) => [detail.order_id, detail]),
    );
    const itemsByOrder = items.reduce<
      Record<string, Array<{ name: string; quantity: number; unitPrice: number }>>
    >((groups, item) => {
      const current = groups[item.order_id] ?? [];

      groups[item.order_id] = [
        ...current,
        {
          name: item.custom_name ?? "Item",
          quantity: numberValue(item.quantity),
          unitPrice: numberValue(item.unit_price),
        },
      ];

      return groups;
    }, {});
    const publicOrders = orders
      .filter((order) => {
        const detailPhone = detailsByOrder[order.id]?.phone;
        const customerPhone = order.customer_id ? customersById[order.customer_id] : undefined;
        const actualPhone = detailPhone ? normalizedPhone(detailPhone) : customerPhone;

        return actualPhone === expectedPhoneByOrder[order.id];
      })
      .map((order) => {
        const orderItems = itemsByOrder[order.id] ?? [];
        const subtotal = orderItems.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0,
        );
        const deliveryFee = numberValue(order.delivery_fee);
        const total = Math.max(0, subtotal + deliveryFee - numberValue(order.discount));
        const detail = detailsByOrder[order.id];

        return {
          id: order.id,
          code: order.code,
          status: order.status,
          statusLabel: publicStatusLabel[order.status],
          openedAt: order.opened_at,
          etaMin: numberValue(detail?.eta_min) || 35,
          etaMax: numberValue(detail?.eta_max) || 55,
          total,
          items: orderItems,
        };
      });

    return Response.json({ ok: true, orders: publicOrders });
  } catch (error) {
    console.error("Delivery lookup failed", error);

    return Response.json(
      {
        error: "lookup_failed",
        message: "Nao foi possivel carregar seus pedidos agora.",
      },
      { status: 500 },
    );
  }
}
