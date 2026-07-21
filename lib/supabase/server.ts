import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase côté serveur (Server Components, Route Handlers).
 * Utilise la session de l'utilisateur via les cookies → soumis à la RLS.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll appelé depuis un Server Component : ignorable si un
            // middleware rafraîchit déjà la session.
          }
        },
      },
    },
  );
}

/**
 * Client Supabase "admin" (clé service_role) — SERVEUR UNIQUEMENT.
 * Bypass la RLS. Réservé aux webhooks vocaux (Vapi/Retell/Twilio) et aux
 * jobs (relances). NE JAMAIS importer dans du code client.
 */
export function createAdminClient() {
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js");
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
