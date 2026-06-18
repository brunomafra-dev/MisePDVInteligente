import type { SupabaseClient } from "@supabase/supabase-js";
import { deliveryStore, getDeliveryCatalogItem } from "./catalog";

export const seedUnitId = "00000000-0000-4000-8000-000000000101";

export async function queryMust<T>(
  label: string,
  query: PromiseLike<{ data: T; error: unknown }>,
) {
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

export async function resolveDeliveryUnit(client: SupabaseClient) {
  const preferredUnitId = process.env.MISE_DELIVERY_UNIT_ID ?? seedUnitId;
  const unitById = await queryMust(
    "restaurant_units",
    client
      .from("restaurant_units")
      .select("id, organization_id, name")
      .eq("id", preferredUnitId)
      .maybeSingle(),
  );

  if (unitById) return unitById as { id: string; organization_id: string; name: string };

  const organization = await queryMust(
    "organizations",
    client
      .from("organizations")
      .select("id")
      .eq("name", deliveryStore.name)
      .maybeSingle(),
  );

  if (organization && "id" in organization) {
    const unit = await queryMust(
      "restaurant_units",
      client
        .from("restaurant_units")
        .select("id, organization_id, name")
        .eq("organization_id", String(organization.id))
        .limit(1)
        .maybeSingle(),
    );

    if (unit) return unit as { id: string; organization_id: string; name: string };
  }

  const fallback = await queryMust(
    "restaurant_units",
    client.from("restaurant_units").select("id, organization_id, name").limit(1).maybeSingle(),
  );

  if (!fallback) {
    throw new Error("Unidade de delivery nao encontrada");
  }

  return fallback as { id: string; organization_id: string; name: string };
}

export async function getDeliveryAvailability(
  client: SupabaseClient,
  unitId: string,
) {
  const { data, error } = await client
    .from("delivery_catalog_availability")
    .select("item_id, available, updated_at")
    .eq("unit_id", unitId);

  if (error) return {};

  return Object.fromEntries(
    (data ?? []).map((row) => [String(row.item_id), Boolean(row.available)]),
  ) as Record<string, boolean>;
}

export async function assertDeliveryItemsAvailable(
  client: SupabaseClient,
  unitId: string,
  itemIds: string[],
) {
  const availability = await getDeliveryAvailability(client, unitId);
  const unavailable = [...new Set(itemIds)].find(
    (itemId) => availability[itemId] === false,
  );

  if (!unavailable) return;

  const item = getDeliveryCatalogItem(unavailable);

  throw new Error(`${item?.name ?? "Item"} esta indisponivel no momento`);
}
