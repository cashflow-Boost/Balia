import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { genererCreneaux, libelleCreneau, type Horaires } from "@/lib/agenda";

export const dynamic = "force-dynamic";

/**
 * GET /api/disponibilites?entreprise_id=...&duree=120&limite=2
 *
 * Créneaux disponibles en temps réel (BIBLE Tome 14.4). Conçu comme un
 * « outil » que la plateforme vocale (Vapi/Retell) appelle pendant l'appel
 * pour proposer deux créneaux concrets (Tome 7.5).
 *
 * Auth : header x-balia-secret (serveur à serveur).
 */
export async function GET(req: Request) {
  const secret = process.env.VOCAL_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-balia-secret") !== secret) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const entrepriseId = searchParams.get("entreprise_id");
  if (!entrepriseId) {
    return NextResponse.json(
      { error: "entreprise_id requis" },
      { status: 400 },
    );
  }

  const dureeMinutes = Number(searchParams.get("duree")) || 120;
  const limite = Number(searchParams.get("limite")) || 2;

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      { error: "Supabase non configuré" },
      { status: 503 },
    );
  }

  const supabase = createAdminClient();

  const { data: entreprise } = await supabase
    .from("entreprises")
    .select("horaires_ouverture")
    .eq("id", entrepriseId)
    .maybeSingle();

  if (!entreprise) {
    return NextResponse.json(
      { error: "entreprise introuvable" },
      { status: 404 },
    );
  }

  // RDV existants (occupent l'agenda) sur l'horizon.
  const { data: rdv } = await supabase
    .from("rendez_vous")
    .select("date_debut, date_fin")
    .eq("entreprise_id", entrepriseId)
    .in("statut", ["confirme", "reporte"])
    .gte("date_debut", new Date().toISOString());

  const creneaux = genererCreneaux({
    horaires: (entreprise.horaires_ouverture as Horaires) ?? null,
    rdvOccupes: rdv ?? [],
    dureeMinutes,
    limite,
  });

  return NextResponse.json({
    creneaux: creneaux.map((c) => ({ ...c, libelle: libelleCreneau(c) })),
  });
}
