import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { envoyerSms, messageConfirmationRdv } from "@/lib/sms";

export const dynamic = "force-dynamic";

interface CreationRdv {
  entreprise_id?: string;
  appel_id?: string;
  client?: {
    nom?: string;
    telephone?: string;
    adresse?: string;
    code_postal?: string;
  };
  date_debut?: string;
  date_fin?: string;
  type?: string; // urgence, programme, entretien
  description?: string;
}

/**
 * POST /api/rendez-vous — pose un rendez-vous ferme dans l'agenda (Tome 8.1),
 * vérifie l'absence de double-booking (Tome 8.8 règle 1), puis envoie le SMS
 * de confirmation (Tome 8.5). Outil appelé par l'agent vocal en fin de
 * qualification.
 *
 * Auth : header x-balia-secret (serveur à serveur).
 */
export async function POST(req: Request) {
  const secret = process.env.VOCAL_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-balia-secret") !== secret) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: CreationRdv;
  try {
    body = (await req.json()) as CreationRdv;
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { entreprise_id, date_debut, date_fin } = body;
  if (!entreprise_id || !date_debut || !date_fin) {
    return NextResponse.json(
      { error: "entreprise_id, date_debut et date_fin sont requis" },
      { status: 400 },
    );
  }

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
    .select("id, nom")
    .eq("id", entreprise_id)
    .maybeSingle();

  if (!entreprise) {
    return NextResponse.json(
      { error: "entreprise introuvable" },
      { status: 404 },
    );
  }

  // 1. Verrou anti-double-booking : un RDV actif qui recouvre la plage ? -----
  const { data: conflits } = await supabase
    .from("rendez_vous")
    .select("id")
    .eq("entreprise_id", entreprise_id)
    .in("statut", ["confirme", "reporte"])
    .lt("date_debut", date_fin)
    .gt("date_fin", date_debut);

  if (conflits && conflits.length > 0) {
    return NextResponse.json(
      { error: "Créneau déjà réservé", code: "double_booking" },
      { status: 409 },
    );
  }

  // 2. Résolution / création du client final --------------------------------
  let clientId: string | null = null;
  const tel = body.client?.telephone;
  if (tel) {
    const { data: existant } = await supabase
      .from("clients_finaux")
      .select("id")
      .eq("entreprise_id", entreprise_id)
      .eq("telephone", tel)
      .maybeSingle();

    if (existant) {
      clientId = existant.id;
    } else {
      const { data: cree } = await supabase
        .from("clients_finaux")
        .insert({
          entreprise_id,
          nom: body.client?.nom ?? null,
          telephone: tel,
          adresse: body.client?.adresse ?? null,
          code_postal: body.client?.code_postal ?? null,
          canal_prefere: "sms",
        })
        .select("id")
        .single();
      clientId = cree?.id ?? null;
    }
  }

  // 3. Création du rendez-vous ----------------------------------------------
  const { data: rdv, error } = await supabase
    .from("rendez_vous")
    .insert({
      entreprise_id,
      client_id: clientId,
      appel_id: body.appel_id ?? null,
      date_debut,
      date_fin,
      type: body.type ?? "programme",
      statut: "confirme",
      adresse: body.client?.adresse ?? null,
      description: body.description ?? null,
    })
    .select("*")
    .single();

  if (error || !rdv) {
    return NextResponse.json(
      { error: error?.message ?? "Échec de création du RDV" },
      { status: 500 },
    );
  }

  // 4. SMS de confirmation (best-effort : n'échoue pas la prise de RDV) ------
  let sms: Awaited<ReturnType<typeof envoyerSms>> | null = null;
  if (tel) {
    sms = await envoyerSms(
      tel,
      messageConfirmationRdv({
        nomEntreprise: entreprise.nom,
        prenomClient: body.client?.nom ?? null,
        intervention: body.description ?? null,
        dateDebut: date_debut,
        adresse: body.client?.adresse ?? null,
      }),
    );
    if (sms.ok || sms.sid) {
      await supabase
        .from("rendez_vous")
        .update({ rappel_envoye: false })
        .eq("id", rdv.id);
    }
  }

  return NextResponse.json({ rendez_vous: rdv, client_id: clientId, sms });
}
