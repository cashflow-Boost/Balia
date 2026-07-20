// Agent Génération d'annonces + préparation multidiffusion (Bible, Tome 6.1).
// Le texte est relié au bien et revient en carte à valider avant publication.

import { callAgentJson } from "@/lib/claude";
import { hasClaude } from "@/lib/config";
import type { Announcement, PropertyInput } from "@/types";

export const PORTALS = ["SeLoger", "LeBonCoin", "BienIci", "Site de l'agence"];

const SYSTEM = `Tu es l'agent de rédaction d'annonces de Balia, le système d'exploitation IA de l'immobilier francophone.
Ton rôle : rédiger une annonce immobilière optimisée pour les portails (SeLoger, LeBonCoin, BienIci), prête à publier après validation humaine.
Règles :
- Titre accrocheur de moins de 80 caractères.
- Corps structuré : accroche, description du bien, atouts, appel à l'action.
- Français impeccable, aucun superlatif mensonger, aucune information inventée : n'utilise que les données fournies.
- Mentionne le prix uniquement s'il est fourni.`;

const SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    body: { type: "string" },
  },
  required: ["title", "body"],
  additionalProperties: false,
} as const;

export function fallbackAnnouncement(property: PropertyInput): Announcement {
  return {
    title: `${property.kind} ${property.rooms} pièces — ${property.surfaceM2} m² à ${property.city}`,
    body: `À ${property.city}, ${property.kind.toLowerCase()} de ${property.rooms} pièces offrant ${property.surfaceM2} m². ${property.highlights}${property.price ? ` Prix : ${property.price.toLocaleString("fr-FR")} €.` : ""} Contactez-nous pour organiser une visite. (Texte simulé — configurez ANTHROPIC_API_KEY pour la rédaction IA.)`,
    portals: PORTALS,
  };
}

export async function generateAnnouncement(
  property: PropertyInput,
): Promise<Announcement> {
  if (!hasClaude()) {
    return fallbackAnnouncement(property);
  }
  const prompt = `Bien à annoncer :
- Type : ${property.kind}
- Ville : ${property.city}
- Surface : ${property.surfaceM2} m²
- Pièces : ${property.rooms}
- Prix : ${property.price ? `${property.price} €` : "non communiqué"}
- Atouts : ${property.highlights}

Rédige l'annonce.`;
  const result = await callAgentJson<{ title: string; body: string }>({
    system: SYSTEM,
    prompt,
    schema: SCHEMA as unknown as Record<string, unknown>,
  });
  return { ...result, portals: PORTALS };
}
