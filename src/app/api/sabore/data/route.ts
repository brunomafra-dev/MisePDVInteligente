import { AccessError, getAuthenticatedProfile } from "@/lib/supabase/access";
import { getSaboreDataForUnit } from "@/lib/supabase/sabore-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const profile = await getAuthenticatedProfile(request);
    const result = await getSaboreDataForUnit(profile.unitId);

    return Response.json({
      ...result,
      profile: {
        id: profile.id,
        name: profile.name,
        role: profile.role,
        unitId: profile.unitId,
      },
    });
  } catch (error) {
    const status = error instanceof AccessError ? error.status : 500;

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar os dados do Sabore",
      },
      { status },
    );
  }
}
