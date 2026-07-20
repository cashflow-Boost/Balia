// Agent Leads + qualification + RDV (Bible, Tome 6.1) : qualifie un contact
// entrant, prépare une réponse et propose des créneaux — en carte à valider.

import { callAgentJson } from "@/lib/claude";
import { hasClaude } from "@/lib/config";
import type { Lead, LeadQualification } from "@/types";

const SYSTEM = `Tu es l'agent de qualification de leads de Balia, le système d'exploitation IA de l'immobilier francophone (France, Belgique, Suisse, Luxembourg).
Ton rôle : analyser un contact entrant pour une structure immobilière, le scorer, résumer son besoin, rédiger une première réponse chaleureuse et professionnelle sur le canal indiqué, et proposer des créneaux de rendez-vous.
Règles :
- La réponse proposée sera relue et validée par un humain avant tout envoi : rédige-la prête à l'emploi.
- Ton naturel et direct, sans jargon, adapté au canal (SMS court, email plus structuré).
- Propose 2 à 3 créneaux plausibles en jours ouvrés, exprimés en langage naturel (ex. "mardi à 14h").
- Ne promets jamais de prix ni d'engagement contractuel.`;

const SCHEMA = {
  type: "object",
  properties: {
    score: { type: "integer" },
    segment: { type: "string", enum: ["chaud", "tiede", "froid"] },
    summary: { type: "string" },
    proposedReply: { type: "string" },
    proposedSlots: { type: "array", items: { type: "string" } },
  },
  required: ["score", "segment", "summary", "proposedReply", "proposedSlots"],
  additionalProperties: false,
} as const;

export function fallbackQualification(lead: Lead): LeadQualification {
  const hot =
    /achat|acheter|vendre|vente|visite|urgent|estimation/i.test(lead.message);
  return {
    score: hot ? 75 : 45,
    segment: hot ? "chaud" : "tiede",
    summary: `Contact via ${lead.source} (${lead.projectType ?? "projet non précisé"}). Qualification simulée — configurez ANTHROPIC_API_KEY pour l'analyse IA.`,
    proposedReply: `Bonjour ${lead.name}, merci pour votre message. Je vous propose un échange rapide pour bien comprendre votre projet — seriez-vous disponible mardi à 14h ou jeudi à 10h ?`,
    proposedSlots: ["mardi à 14h", "jeudi à 10h"],
  };
}

export async function qualifyLead(lead: Lead): Promise<LeadQualification> {
  if (!hasClaude()) {
    return fallbackQualification(lead);
  }
  const prompt = `Contact entrant à qualifier :
- Prénom/nom : ${lead.name}
- Canal de réponse : ${lead.channel}
- Source : ${lead.source}
- Type de projet déclaré : ${lead.projectType ?? "non précisé"}
- Message : """${lead.message}"""

Produis la qualification.`;
  const result = await callAgentJson<LeadQualification>({
    system: SYSTEM,
    prompt,
    schema: SCHEMA as unknown as Record<string, unknown>,
  });
  return {
    ...result,
    score: Math.max(0, Math.min(100, result.score)),
  };
}
