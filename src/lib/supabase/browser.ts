"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function normalizeSupabaseUrl(url: string) {
  return url.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export function getSupabaseBrowserClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !anonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(normalizeSupabaseUrl(rawUrl), anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }

  return browserClient;
}
