import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Both values are public by design (shipped to every browser); data is protected by RLS.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

/** Browser-side Supabase client (singleton). */
export function supabase(): SupabaseClient {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  client ??= createClient(url!, key!, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return client;
}
