export class PayloadError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

export type JsonPayloadOptions = {
  maxBytes: number;
  requireJsonContentType?: boolean;
};

const jsonContentTypes = ["application/json", "application/problem+json"];

function hasJsonContentType(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  return jsonContentTypes.some((candidate) => contentType.includes(candidate));
}

function contentLength(request: Request) {
  const rawLength = request.headers.get("content-length");

  if (!rawLength) return null;

  const length = Number(rawLength);

  return Number.isFinite(length) && length >= 0 ? length : null;
}

export async function parseJsonPayload(
  request: Request,
  { maxBytes, requireJsonContentType = true }: JsonPayloadOptions,
) {
  if (requireJsonContentType && !hasJsonContentType(request)) {
    throw new PayloadError("Content-Type precisa ser application/json", 415);
  }

  const declaredLength = contentLength(request);

  if (declaredLength !== null && declaredLength > maxBytes) {
    throw new PayloadError("Payload muito grande", 413);
  }

  const rawBody = await request.text();
  const actualBytes = new TextEncoder().encode(rawBody).byteLength;

  if (actualBytes > maxBytes) {
    throw new PayloadError("Payload muito grande", 413);
  }

  if (!rawBody.trim()) {
    throw new PayloadError("Payload vazio", 400);
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw new PayloadError("JSON malformado", 400);
  }
}

export function payloadErrorResponse(error: PayloadError) {
  return Response.json({ error: "invalid_payload", message: error.message }, { status: error.status });
}
