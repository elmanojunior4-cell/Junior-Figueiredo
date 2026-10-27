import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let client: SupabaseClient | null = null;

/** Cliente do Supabase com a service role. Só roda no servidor. */
export function db(): SupabaseClient {
  if (!client) {
    client = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export async function logEvent(galleryId: string, type: string, data: Record<string, unknown> = {}) {
  await db().from("gallery_events").insert({ gallery_id: galleryId, type, data });
}
