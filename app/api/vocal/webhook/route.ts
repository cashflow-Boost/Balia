import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { normalizeCallEvent } from "@/lib/agent/qualification";
import type { ResultatAppel } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Webhook vocal Balia — reçoit les événements de la plateforme (Vapi/Retell)
 * en fin d'appel, et journalise l'appel qualifié dans `appels` (Tome 28.6,
 * étape 2 « capture + journalisation »).
 *
 * Sécurité : header `x-balia-secret` comparé à VOCAL_WEBHOOK_SECRET.
 * Écriture via la clé service_role (bypass RLS) — serveur uniquement.
 */
export async function POST(req: Request) {
  // 1. Vérification du secret partagé -----------------------------------
  const secret = process.env.VOCAL_WEBHOOK_SECRET;
  if (secret) {
    const provided = req.headers.get("x-balia-secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
  }

  // 2. Parse + normalisation (Vapi ou Retell) ---------------------------
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const event = normalizeCallEvent(body);

  // On n'agit qu'en fin d'appel (les autres événements sont acquittés).
  if (!event.isEndOfCall) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      { error: "Supabase non configuré (service_role manquant)" },
      { status: 503 },
    );
  }

  const supabase = createAdminClient();

  // 3. Résolution de l'entreprise ---------------------------------------
  //    Priorité : entreprise_id en metadata ; sinon lookup par numéro Balia.
  let entrepriseId = event.entrepriseId;
  if (!entrepriseId && event.numeroAppele) {
    const { data } = await supabase
      .from("entreprises")
      .select("id")
      .eq("numero_balia", event.numeroAppele)
      .maybeSingle();
    entrepriseId = data?.id ?? null;
  }

  if (!entrepriseId) {
    // On acquitte pour éviter les retries en boucle, mais on signale.
    return NextResponse.json(
      { ok: false, reason: "entreprise introuvable" },
      { status: 202 },
    );
  }

  const q = event.qualification;

  // 4. Upsert du client final (si on a un téléphone) --------------------
  let clientId: string | null = null;
  const telephoneClient = q.telephone ?? event.numeroAppelant;
  if (telephoneClient) {
    const { data: existing } = await supabase
      .from("clients_finaux")
      .select("id")
      .eq("entreprise_id", entrepriseId)
      .eq("telephone", telephoneClient)
      .maybeSingle();

    if (existing) {
      clientId = existing.id;
    } else {
      const { data: created } = await supabase
        .from("clients_finaux")
        .insert({
          entreprise_id: entrepriseId,
          nom: q.nom_client ?? null,
          telephone: telephoneClient,
          adresse: q.adresse ?? null,
          code_postal: q.code_postal ?? null,
          canal_prefere: "appel",
        })
        .select("id")
        .single();
      clientId = created?.id ?? null;
    }
  }

  // 5. Journalisation de l'appel ----------------------------------------
  const resultat: ResultatAppel = q.resultat ?? "qualifie";
  const transfere = resultat === "transfere";

  const { data: appel, error } = await supabase
    .from("appels")
    .insert({
      entreprise_id: entrepriseId,
      numero_appelant: event.numeroAppelant,
      duree_secondes: event.dureeSecondes,
      mode: null, // débordement/hors_horaire/complet : à passer en metadata
      resultat,
      urgence: q.urgence ?? null,
      transcript: event.transcript,
      enregistrement_url: event.enregistrementUrl,
      ca_estime: q.ca_estime ?? null,
      transfere,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    appel_id: appel?.id ?? null,
    client_id: clientId,
    resultat,
  });
}
