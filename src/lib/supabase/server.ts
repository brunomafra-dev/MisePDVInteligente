import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env/server";

let adminClient: SupabaseClient | null = null;
let dataClient: SupabaseClient | null = null;
let authClient: SupabaseClient | null = null;

export function normalizeSupabaseUrl(url: string) {
  return url.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export function getSupabaseAdmin() {
  const env = getServerEnv();
  const url = env.supabaseUrl ? normalizeSupabaseUrl(env.supabaseUrl) : "";
  const key = env.supabaseServiceRoleKey;

  if (!url || !key) {
    throw new Error("Supabase env vars are missing");
  }

  if (!adminClient) {
    adminClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}

export function getSupabaseDataClient() {
  const env = getServerEnv();
  const rawUrl = env.supabaseUrl;
  const key = env.supabaseServiceRoleKey ?? env.supabaseAnonKey;

  if (!rawUrl || !key) {
    return null;
  }

  const url = normalizeSupabaseUrl(rawUrl);

  if (!dataClient) {
    dataClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return dataClient;
}

export function getSupabaseAuthClient() {
  const env = getServerEnv();
  const rawUrl = env.supabaseUrl;
  const key = env.supabaseAnonKey;

  if (!rawUrl || !key) {
    throw new Error("Supabase auth env vars are missing");
  }

  const url = normalizeSupabaseUrl(rawUrl);

  if (!authClient) {
    authClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return authClient;
}
