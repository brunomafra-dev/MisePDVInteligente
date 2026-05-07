import { NextResponse } from "next/server";
import { getFiscalProvider } from "@/lib/integrations/focus-nfe";
import { issueNfceSchema } from "@/lib/integrations/contracts";
import {
  parseJsonPayload,
  PayloadError,
  payloadErrorResponse,
} from "@/lib/security/request";
import { apiRateLimit, enforceRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, apiRateLimit("fiscal:nfce"));

  if (limited) return limited;

  let payload: unknown;

  try {
    payload = await parseJsonPayload(request, { maxBytes: 64 * 1024 });
  } catch (error) {
    if (error instanceof PayloadError) {
      return payloadErrorResponse(error);
    }

    throw error;
  }

  const parsed = issueNfceSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const result = await getFiscalProvider().issueNfce(parsed.data);

  return NextResponse.json(result, {
    status: result.status === "rejected" ? 422 : 201,
  });
}
