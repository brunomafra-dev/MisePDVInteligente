import { NextResponse } from "next/server";
import { whatsappTemplateSchema } from "@/lib/integrations/contracts";
import { getWhatsAppProvider } from "@/lib/integrations/whatsapp";
import {
  parseJsonPayload,
  PayloadError,
  payloadErrorResponse,
} from "@/lib/security/request";
import { apiRateLimit, enforceRateLimit } from "@/lib/security/rate-limit";
import { AccessError, getAuthenticatedProfile } from "@/lib/supabase/access";

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, apiRateLimit("whatsapp:send"));

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

  const parsed = whatsappTemplateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const profile = await getAuthenticatedProfile(request);

    if (profile.unitId !== parsed.data.unitId) {
      return NextResponse.json(
        { error: "Usuario sem acesso a esta unidade" },
        { status: 403 },
      );
    }

    const result = await getWhatsAppProvider().sendTemplate(parsed.data);

    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    const status = error instanceof AccessError ? error.status : 500;

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel enviar WhatsApp",
      },
      { status },
    );
  }
}
