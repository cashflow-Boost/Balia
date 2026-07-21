import type { ResultatAppel, Urgence } from "@/lib/types";

/**
 * Données de qualification extraites en fin d'appel (schéma Tome 28.4),
 * telles que renvoyées par la plateforme vocale dans le webhook.
 */
export interface QualificationData {
  nature_probleme?: string;
  urgence?: Urgence;
  code_postal?: string;
  dans_zone?: boolean;
  nom_client?: string;
  telephone?: string;
  adresse?: string;
  creneau_souhaite?: string;
  ca_estime?: number;
  resultat?: ResultatAppel;
}

/**
 * Événement d'appel normalisé, indépendant du fournisseur (Vapi / Retell).
 */
export interface NormalizedCallEvent {
  /** Événement de fin d'appel exploitable ? (sinon on ignore : status update, etc.) */
  isEndOfCall: boolean;
  numeroAppelant: string | null;
  /** Numéro Balia appelé — sert à retrouver l'entreprise. */
  numeroAppele: string | null;
  /** entreprise_id passé en metadata côté plateforme (prioritaire). */
  entrepriseId: string | null;
  dureeSecondes: number | null;
  transcript: string | null;
  enregistrementUrl: string | null;
  qualification: QualificationData;
}

const VALID_URGENCE: Urgence[] = ["immediat", "jour", "semaine", "programme"];
const VALID_RESULTAT: ResultatAppel[] = [
  "rdv_pris",
  "qualifie",
  "transfere",
  "hors_perimetre",
  "perdu",
];

function coerceQualification(raw: unknown): QualificationData {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;
  const q: QualificationData = {};

  if (typeof r.nature_probleme === "string") q.nature_probleme = r.nature_probleme;
  if (typeof r.code_postal === "string") q.code_postal = r.code_postal;
  if (typeof r.nom_client === "string") q.nom_client = r.nom_client;
  if (typeof r.telephone === "string") q.telephone = r.telephone;
  if (typeof r.adresse === "string") q.adresse = r.adresse;
  if (typeof r.creneau_souhaite === "string")
    q.creneau_souhaite = r.creneau_souhaite;
  if (typeof r.dans_zone === "boolean") q.dans_zone = r.dans_zone;
  if (typeof r.ca_estime === "number") q.ca_estime = r.ca_estime;
  if (typeof r.ca_estime === "string" && !Number.isNaN(Number(r.ca_estime)))
    q.ca_estime = Number(r.ca_estime);
  if (VALID_URGENCE.includes(r.urgence as Urgence))
    q.urgence = r.urgence as Urgence;
  if (VALID_RESULTAT.includes(r.resultat as ResultatAppel))
    q.resultat = r.resultat as ResultatAppel;

  return q;
}

/**
 * Normalise un payload Vapi OU Retell en un événement commun.
 * Les formats des deux plateformes diffèrent — on gère les deux et on
 * documente les chemins. À recalibrer sur les vrais payloads en Jour 1.
 */
export function normalizeCallEvent(body: unknown): NormalizedCallEvent {
  const empty: NormalizedCallEvent = {
    isEndOfCall: false,
    numeroAppelant: null,
    numeroAppele: null,
    entrepriseId: null,
    dureeSecondes: null,
    transcript: null,
    enregistrementUrl: null,
    qualification: {},
  };

  if (!body || typeof body !== "object") return empty;
  const b = body as Record<string, any>;

  // ── Vapi : { message: { type: "end-of-call-report", ... } } ───────────
  if (b.message?.type) {
    const m = b.message;
    const isEnd = m.type === "end-of-call-report";
    const call = m.call ?? {};
    return {
      isEndOfCall: isEnd,
      numeroAppelant: call.customer?.number ?? null,
      numeroAppele: call.phoneNumber?.number ?? call.phoneNumberId ?? null,
      entrepriseId:
        call.metadata?.entreprise_id ??
        call.assistantOverrides?.metadata?.entreprise_id ??
        null,
      dureeSecondes:
        typeof m.durationSeconds === "number"
          ? Math.round(m.durationSeconds)
          : null,
      transcript: m.transcript ?? m.artifact?.transcript ?? null,
      enregistrementUrl: m.recordingUrl ?? m.artifact?.recordingUrl ?? null,
      qualification: coerceQualification(
        m.analysis?.structuredData ?? m.structuredData,
      ),
    };
  }

  // ── Retell : { event: "call_analyzed" | "call_ended", call: {...} } ───
  if (b.event && b.call) {
    const isEnd = b.event === "call_analyzed" || b.event === "call_ended";
    const call = b.call;
    const durationMs =
      call.end_timestamp && call.start_timestamp
        ? call.end_timestamp - call.start_timestamp
        : null;
    return {
      isEndOfCall: isEnd,
      numeroAppelant: call.from_number ?? null,
      numeroAppele: call.to_number ?? null,
      entrepriseId: call.metadata?.entreprise_id ?? null,
      dureeSecondes: durationMs ? Math.round(durationMs / 1000) : null,
      transcript: call.transcript ?? null,
      enregistrementUrl: call.recording_url ?? null,
      qualification: coerceQualification(
        call.call_analysis?.custom_analysis_data,
      ),
    };
  }

  return empty;
}
