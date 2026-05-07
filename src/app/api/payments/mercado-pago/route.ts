import { NextResponse } from "next/server";
import { createPaymentSchema } from "@/lib/integrations/contracts";
import { getPaymentProvider } from "@/lib/integrations/mercado-pago";
import {
  parseJsonPayload,
  PayloadError,
  payloadErrorResponse,
} from "@/lib/security/request";
import { apiRateLimit, enforceRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, apiRateLimit("payments:mercado-pago"));

  if (limited) return limited;

  let payload: unknown;

  try {
    payload = await parseJsonPayload(request, { maxBytes: 16 * 1024 });
  } catch (error) {
    if (error instanceof PayloadError) {
      return payloadErrorResponse(error);
    }

    throw error;
  }

  const parsed = createPaymentSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const result = await getPaymentProvider().createPayment(parsed.data);

  return NextResponse.json(result, { status: 201 });
}
