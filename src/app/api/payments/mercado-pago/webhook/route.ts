import { NextResponse } from "next/server";
import {
  parseJsonPayload,
  PayloadError,
  payloadErrorResponse,
} from "@/lib/security/request";
import { apiRateLimit, enforceRateLimit } from "@/lib/security/rate-limit";

const seenEvents = new Set<string>();

export async function POST(request: Request) {
  const limited = await enforceRateLimit(
    request,
    apiRateLimit("payments:mercado-pago:webhook"),
  );

  if (limited) return limited;

  const eventId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  let payload: unknown;

  try {
    payload = await parseJsonPayload(request, { maxBytes: 64 * 1024 });
  } catch (error) {
    if (error instanceof PayloadError) {
      return payloadErrorResponse(error);
    }

    throw error;
  }

  const duplicate = seenEvents.has(eventId);

  seenEvents.add(eventId);

  return NextResponse.json({
    ok: true,
    duplicate,
    eventId,
    received: payload,
  });
}
