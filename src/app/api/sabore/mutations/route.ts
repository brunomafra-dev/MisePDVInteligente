import type { SupabaseClient } from "@supabase/supabase-js";
import { saboreMutationSchema, type SaboreMutation } from "@/lib/sabore-mutations";
import {
  AccessError,
  canPerform,
  getAuthenticatedProfile,
  type AuthenticatedProfile,
} from "@/lib/supabase/access";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type DbLot = {
  id: string;
  quantity: number | string;
};

function orderRow(order: SaboreMutation & { type: "create_order" }) {
  return {
    id: order.order.id,
    unit_id: order.order.unitId,
    code: order.order.code,
    channel: order.order.channel,
    status: order.order.status,
    table_id: order.order.tableId ?? null,
    customer_id: order.order.customerId ?? null,
    delivery_fee: order.order.deliveryFee,
    discount: order.order.discount,
    fiscal_status: order.order.fiscalStatus,
    whatsapp_status: order.order.whatsappStatus,
    opened_at: order.order.openedAt,
  };
}

function orderItemRows(orderId: string, items: Extract<SaboreMutation, { type: "append_order_items" }>["items"]) {
  return items.map((item) => ({
    id: item.id,
    order_id: orderId,
    product_id: item.productId,
    quantity: item.quantity,
    custom_name: item.name ?? null,
    unit_price: item.unitPrice ?? null,
    notes: item.notes ?? null,
  }));
}

function movementRows(movements: Extract<SaboreMutation, { type: "create_order" }>["movements"]) {
  return movements.map((movement) => ({
    id: movement.id,
    unit_id: movement.unitId,
    ingredient_id: movement.ingredientId,
    order_id: movement.orderId ?? null,
    type: movement.type,
    quantity: movement.quantity,
    cost_impact: movement.costImpact,
    reason: movement.reason,
    created_at: movement.createdAt,
  }));
}

function paymentRow(payment: Extract<SaboreMutation, { type: "pay_order" }>["payment"], orderId: string) {
  return {
    id: payment.id,
    order_id: orderId,
    method: payment.method,
    amount: payment.amount,
    external_id: payment.externalId ?? null,
    received_at: payment.receivedAt,
  };
}

function lotRow(lot: NonNullable<Extract<SaboreMutation, { type: "stock_adjustment" }>["lot"]>) {
  return {
    id: lot.id,
    ingredient_id: lot.ingredientId,
    supplier: lot.supplier,
    batch_code: lot.batchCode,
    quantity: lot.quantity,
    expires_at: lot.expiresAt,
    received_at: lot.receivedAt,
  };
}

async function must<T>(label: string, query: PromiseLike<{ data: T; error: unknown }>) {
  const { data, error } = await query;

  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error && "message" in error
          ? String(error.message)
          : "erro desconhecido";

    throw new Error(`${label}: ${message}`);
  }

  return data;
}

function ensureUnit(unitId: string, profile: AuthenticatedProfile) {
  if (unitId !== profile.unitId) {
    throw new AccessError("Operacao fora da unidade do usuario", 403);
  }
}

async function assertRows(
  client: SupabaseClient,
  label: string,
  table: string,
  column: string,
  ids: string[],
  profile: AuthenticatedProfile,
) {
  const uniqueIds = [...new Set(ids)];

  if (uniqueIds.length === 0) return;

  const rows = (await must(
    label,
    client.from(table).select("id").in(column, uniqueIds).eq("unit_id", profile.unitId),
  )) as Array<{ id: string }>;

  if (rows.length !== uniqueIds.length) {
    throw new AccessError("Registro nao pertence a unidade do usuario", 403);
  }
}

async function assertOrderAccess(
  client: SupabaseClient,
  orderId: string,
  profile: AuthenticatedProfile,
) {
  const rows = (await must(
    "orders access",
    client.from("orders").select("id").eq("id", orderId).eq("unit_id", profile.unitId),
  )) as Array<{ id: string }>;

  if (rows.length !== 1) {
    throw new AccessError("Pedido nao pertence a unidade do usuario", 403);
  }
}

async function assertRecipeAccess(
  client: SupabaseClient,
  mutation: Extract<SaboreMutation, { type: "create_recipe_item" }>,
  profile: AuthenticatedProfile,
) {
  await assertRows(
    client,
    "recipe product access",
    "products",
    "id",
    [mutation.recipeItem.productId],
    profile,
  );
  await assertRows(
    client,
    "recipe ingredient access",
    "ingredients",
    "id",
    [mutation.recipeItem.ingredientId],
    profile,
  );
}

async function authorizeMutation(
  client: SupabaseClient,
  mutation: SaboreMutation,
  profile: AuthenticatedProfile,
) {
  if (!canPerform(profile.role, mutation.type)) {
    throw new AccessError("Perfil sem permissao para esta operacao", 403);
  }

  switch (mutation.type) {
    case "create_order": {
      ensureUnit(mutation.order.unitId, profile);
      mutation.movements.forEach((movement) => ensureUnit(movement.unitId, profile));
      await assertRows(
        client,
        "order product access",
        "products",
        "id",
        mutation.order.items.map((item) => item.productId),
        profile,
      );
      if (mutation.order.tableId) {
        await assertRows(
          client,
          "order table access",
          "dining_tables",
          "id",
          [mutation.order.tableId],
          profile,
        );
      }
      break;
    }
    case "append_order_items": {
      await assertOrderAccess(client, mutation.orderId, profile);
      mutation.movements.forEach((movement) => ensureUnit(movement.unitId, profile));
      await assertRows(
        client,
        "append product access",
        "products",
        "id",
        mutation.items.map((item) => item.productId),
        profile,
      );
      break;
    }
    case "update_order_status":
    case "update_whatsapp_status": {
      await assertOrderAccess(client, mutation.orderId, profile);
      break;
    }
    case "pay_order": {
      await assertOrderAccess(client, mutation.orderId, profile);
      if (mutation.tableId) {
        await assertRows(
          client,
          "payment table access",
          "dining_tables",
          "id",
          [mutation.tableId],
          profile,
        );
      }
      break;
    }
    case "close_cash": {
      const rows = (await must(
        "cash session access",
        client
          .from("cash_sessions")
          .select("id")
          .eq("id", mutation.cashSessionId)
          .eq("unit_id", profile.unitId),
      )) as Array<{ id: string }>;

      if (rows.length !== 1) {
        throw new AccessError("Caixa nao pertence a unidade do usuario", 403);
      }
      break;
    }
    case "create_product": {
      ensureUnit(mutation.product.unitId, profile);
      break;
    }
    case "create_recipe_item": {
      await assertRecipeAccess(client, mutation, profile);
      break;
    }
    case "create_table": {
      ensureUnit(mutation.table.unitId, profile);
      break;
    }
    case "stock_adjustment": {
      ensureUnit(mutation.movement.unitId, profile);
      await assertRows(
        client,
        "stock ingredient access",
        "ingredients",
        "id",
        [mutation.movement.ingredientId],
        profile,
      );
      if (mutation.lot) {
        if (mutation.lot.ingredientId !== mutation.movement.ingredientId) {
          throw new AccessError("Lote e movimento precisam usar o mesmo insumo", 400);
        }
        await assertRows(
          client,
          "stock lot ingredient access",
          "ingredients",
          "id",
          [mutation.lot.ingredientId],
          profile,
        );
      }
      break;
    }
  }
}

async function insertMovements(
  client: SupabaseClient,
  movements: Extract<SaboreMutation, { type: "create_order" }>["movements"],
) {
  if (movements.length === 0) return;

  await must("inventory_movements", client.from("inventory_movements").insert(movementRows(movements)));
  await deductLotsForMovements(client, movements);
}

async function deductLotsForMovements(
  client: SupabaseClient,
  movements: Extract<SaboreMutation, { type: "create_order" }>["movements"],
) {
  for (const movement of movements) {
    if (movement.quantity >= 0) continue;

    let remaining = Math.abs(movement.quantity);
    const lots = await must(
      "inventory_lots select",
      client
        .from("inventory_lots")
        .select("id, quantity")
        .eq("ingredient_id", movement.ingredientId)
        .gt("quantity", 0)
        .order("expires_at", { ascending: true }),
    ) as DbLot[];

    for (const lot of lots) {
      if (remaining <= 0) break;

      const currentQuantity = Number(lot.quantity);
      const consumed = Math.min(currentQuantity, remaining);
      const nextQuantity = Number((currentQuantity - consumed).toFixed(3));
      remaining = Number((remaining - consumed).toFixed(3));

      await must(
        "inventory_lots update",
        client.from("inventory_lots").update({ quantity: nextQuantity }).eq("id", lot.id),
      );
    }
  }
}

async function handleMutation(client: SupabaseClient, mutation: SaboreMutation) {
  switch (mutation.type) {
    case "create_order": {
      await must("orders", client.from("orders").insert(orderRow(mutation)));
      await must(
        "order_items",
        client.from("order_items").insert(orderItemRows(mutation.order.id, mutation.order.items)),
      );
      await insertMovements(client, mutation.movements);

      if (mutation.order.tableId) {
        await must(
          "dining_tables",
          client
            .from("dining_tables")
            .update({ status: "open" })
            .eq("id", mutation.order.tableId),
        );
      }
      break;
    }
    case "append_order_items": {
      await must(
        "order_items",
        client.from("order_items").insert(orderItemRows(mutation.orderId, mutation.items)),
      );
      await insertMovements(client, mutation.movements);
      break;
    }
    case "update_order_status": {
      await must(
        "orders",
        client
          .from("orders")
          .update({ status: mutation.status })
          .eq("id", mutation.orderId),
      );
      break;
    }
    case "pay_order": {
      await must(
        "payments",
        client.from("payments").upsert(paymentRow(mutation.payment, mutation.orderId)),
      );
      await must(
        "orders",
        client
          .from("orders")
          .update({ status: "paid", closed_at: mutation.payment.receivedAt })
          .eq("id", mutation.orderId),
      );

      if (mutation.tableId) {
        await must(
          "dining_tables",
          client.from("dining_tables").update({ status: "free" }).eq("id", mutation.tableId),
        );
      }
      break;
    }
    case "update_whatsapp_status": {
      await must(
        "orders",
        client
          .from("orders")
          .update({ whatsapp_status: mutation.whatsappStatus })
          .eq("id", mutation.orderId),
      );
      break;
    }
    case "close_cash": {
      await must(
        "cash_sessions",
        client
          .from("cash_sessions")
          .update({
            status: "closed",
            expected_amount: mutation.expectedAmount,
            closed_at: new Date().toISOString(),
          })
          .eq("id", mutation.cashSessionId),
      );
      break;
    }
    case "create_product": {
      await must(
        "products",
        client.from("products").insert({
          id: mutation.product.id,
          unit_id: mutation.product.unitId,
          name: mutation.product.name,
          category: mutation.product.category,
          price: mutation.product.price,
          active: mutation.product.active,
          preparation_area: mutation.product.preparationArea,
        }),
      );
      break;
    }
    case "create_recipe_item": {
      await must(
        "recipe_items",
        client.from("recipe_items").insert({
          id: mutation.recipeItem.id,
          product_id: mutation.recipeItem.productId,
          ingredient_id: mutation.recipeItem.ingredientId,
          quantity: mutation.recipeItem.quantity,
        }),
      );
      break;
    }
    case "create_table": {
      await must(
        "dining_tables",
        client.from("dining_tables").insert({
          id: mutation.table.id,
          unit_id: mutation.table.unitId,
          label: mutation.table.label,
          seats: mutation.table.seats,
          status: mutation.table.status,
        }),
      );
      break;
    }
    case "stock_adjustment": {
      if (mutation.lot) {
        await must("inventory_lots", client.from("inventory_lots").insert(lotRow(mutation.lot)));
      }

      await insertMovements(client, [mutation.movement]);
      break;
    }
  }
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = saboreMutationSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      { error: "Payload invalido", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const client = getSupabaseAdmin();
    const profile = await getAuthenticatedProfile(request, client);

    await authorizeMutation(client, parsed.data, profile);
    await handleMutation(client, parsed.data);

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Sabore mutation failed", error);
    const status = error instanceof AccessError ? error.status : 500;

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel persistir a operacao",
      },
      { status },
    );
  }
}
