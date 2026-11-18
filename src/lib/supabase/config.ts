import { parseSupabaseEnv } from "@/lib/validations/supabase-env";

export function getSupabaseConfig() {
  return parseSupabaseEnv({
    // Next.js replaces these static references in browser bundles.
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}
