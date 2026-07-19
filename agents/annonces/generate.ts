// Agent Génération d'annonces (MVP, brief §10). Produit un brouillon d'annonce
// à partir des caractéristiques du bien — jamais publié sans validation :
// le résultat part dans la file d'approbation (carte de résultat).

import Anthropic from '@anthropic-ai/sdk';
import { getClaudeClient, VOLUME_MODEL } from '../../lib/claude';

export interface PropertyInput {
  kind: 'appartement' | 'maison' | 'terrain' | 'local';
  city: string;
  surfaceM2: number;
  rooms: number;
  price: number;
  highlights: string; // texte libre dicté par l'agent (balcon, refait à neuf…)
}

export interface AnnonceDraft {
  title: string;
  body: string;
  generatedBy: 'claude' | 'demo';
}

const SYSTEM_PROMPT = `Tu rédiges des annonces immobilières en français pour des professionnels (France/Belgique/Suisse/Luxembourg).
Style : factuel, chaleureux, sans superlatifs creux ni majuscules abusives. Interdits : toute mention discriminatoire, toute promesse de rendement chiffrée, toute information non fournie (n'invente aucun détail).
Réponds en deux parties séparées par une ligne "---" : d'abord un titre court (max 80 caractères), puis le corps de l'annonce (120 à 180 mots).`;

function demoDraft(input: PropertyInput): AnnonceDraft {
  return {
    title: `${capitalize(input.kind)} ${input.rooms} pièces de ${input.surfaceM2} m² — ${input.city}`,
    body:
      `À ${input.city}, découvrez ce ${input.kind} de ${input.rooms} pièces offrant ${input.surfaceM2} m². ` +
      `${input.highlights ? input.highlights + '. ' : ''}` +
      `Proposé à ${input.price.toLocaleString('fr-FR')} €. ` +
      `Contactez-nous pour organiser une visite.\n\n(Brouillon de démonstration — configurez ANTHROPIC_API_KEY pour la génération complète par Claude.)`,
    generatedBy: 'demo',
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function generateAnnonce(input: PropertyInput): Promise<AnnonceDraft> {
  if (!process.env.ANTHROPIC_API_KEY) return demoDraft(input);

  const prompt =
    `Bien : ${input.kind}, ${input.city}, ${input.surfaceM2} m², ${input.rooms} pièces, ` +
    `prix ${input.price} €. Points forts dictés par l'agent : ${input.highlights || 'aucun'}.`;

  try {
    const response = await getClaudeClient().messages.create({
      model: VOLUME_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')?.text;
    if (!text) return demoDraft(input);
    const [title, ...rest] = text.split('---');
    return {
      title: (title ?? '').trim() || demoDraft(input).title,
      body: rest.join('---').trim() || text.trim(),
      generatedBy: 'claude',
    };
  } catch {
    // Pas d'échec silencieux côté UI : le brouillon de secours l'indique clairement.
    return demoDraft(input);
  }
}
