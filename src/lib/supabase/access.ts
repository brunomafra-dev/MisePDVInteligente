import type { SupabaseClient } from "@supabase/supabase-js";
import type { Role } from "@/lib/types";
import { getSupabaseAdmin } from "./server";

export type AuthenticatedProfile = {
  id: string;
  authUserId: string;
  unitId: string;
  name: string;
  role: Role;
};

export class AccessError extends Error {
  constructor(
    message: string,
    readonly status = 401,
  ) {
    super(message);
  }
}

function bearerToken(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function getAuthenticatedProfile(
  request: Request,
  client: SupabaseClient = getSupabaseAdmin(),
): Promise<AuthenticatedProfile> {
  const token = bearerToken(request);

  if (!token) {
    throw new AccessError("Login obrigatorio", 401);
  }

  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);

  if (error || !user) {
    throw new AccessError("Sessao invalida ou expirada", 401);
  }

  const { data: profile, error: profileError } = await client
    .from("user_profiles")
    .select("id, auth_user_id, unit_id, name, role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new AccessError(`Perfil indisponivel: ${profileError.message}`, 500);
  }

  if (!profile) {
    throw new AccessError("Usuario sem perfil vinculado a uma unidade", 403);
  }

  return {
    id: String(profile.id),
    authUserId: String(profile.auth_user_id),
    unitId: String(profile.unit_id),
    name: String(profile.name),
    role: profile.role as Role,
  };
}

export function canPerform(role: Role, mutationType: string) {
  if (role === "owner" || role === "manager") return true;

  const permissions: Record<Role, string[]> = {
    owner: [],
    manager: [],
    cashier: [
      "create_order",
      "append_order_items",
      "update_order_status",
      "pay_order",
      "update_whatsapp_status",
      "update_delivery_item_availability",
      "close_cash",
    ],
    kitchen: ["update_order_status"],
    stock: ["stock_adjustment", "create_recipe_item", "create_ingredient"],
  };

  return permissions[role]?.includes(mutationType) ?? false;
}
