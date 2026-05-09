import { deliveryStore } from "@/features/delivery-proprio/catalog";
import {
  getDeliveryAvailability,
  resolveDeliveryUnit,
} from "@/features/delivery-proprio/server";
import { apiRateLimit, enforceRateLimit } from "@/lib/security/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const limited = await enforceRateLimit(request, apiRateLimit("delivery:pizza-e-cia:menu"));

  if (limited) return limited;

  try {
    const client = getSupabaseAdmin();
    const unit = await resolveDeliveryUnit(client);
    const availability = await getDeliveryAvailability(client, unit.id);

    return Response.json({
      ok: true,
      store: {
        name: deliveryStore.name,
        open: true,
      },
      availability,
    });
  } catch (error) {
    return Response.json({
      ok: true,
      store: {
        name: deliveryStore.name,
        open: true,
      },
      availability: {},
      warning:
        error instanceof Error
          ? error.message
          : "Disponibilidade dinamica indisponivel",
    });
  }
}
