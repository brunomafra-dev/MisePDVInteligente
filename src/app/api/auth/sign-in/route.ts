import { z } from "zod";
import {
  parseJsonPayload,
  PayloadError,
  payloadErrorResponse,
} from "@/lib/security/request";
import { authRateLimit, enforceRateLimit } from "@/lib/security/rate-limit";
import { emailField, passwordField, sanitizeText } from "@/lib/security/sanitize";
import { getSupabaseAuthClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const signInSchema = z.object({
  email: emailField(),
  password: passwordField(1, 256),
});

function payloadEmail(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("email" in payload)) {
    return "invalid";
  }

  const email = payload.email;

  return typeof email === "string" ? sanitizeText(email).toLowerCase() : "invalid";
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await parseJsonPayload(request, { maxBytes: 8_192 });
  } catch (error) {
    if (error instanceof PayloadError) {
      return payloadErrorResponse(error);
    }

    throw error;
  }

  const limited = await enforceRateLimit(
    request,
    authRateLimit("auth:sign-in", payloadEmail(payload)),
  );

  if (limited) return limited;

  const parsed = signInSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      { error: "invalid_payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { data, error } = await getSupabaseAuthClient().auth.signInWithPassword(
    parsed.data,
  );

  if (error || !data.session) {
    return Response.json({ error: "Email ou senha invalidos" }, { status: 401 });
  }

  return Response.json({ session: data.session });
}
