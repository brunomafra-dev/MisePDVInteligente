import { NextResponse } from "next/server";
import { whatsappTemplateSchema } from "@/lib/integrations/contracts";
import { getWhatsAppProvider } from "@/lib/integrations/whatsapp";
import {
  parseJsonPayload,
  PayloadError,
  payloadErrorResponse,
} from "@/lib/security/request";
import { apiRateLimit, enforceRateLimit } from "@/lib/security/rate-limit";

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

  const result = await getWhatsAppProvider().sendTemplate(parsed.data);

  return NextResponse.json(result, { status: 202 });
}
