// Qualification d'un lead par Claude (spec §6) : extraction structurée
// {projet, budget, financement, délai} + classification in/out of scenario.
// Sortie JSON garantie par output_config.format — jamais de parsing de texte libre.
// En cas d'échec de l'appel, on n'invente rien : le lead passe en awaiting_human.

import Anthropic from '@anthropic-ai/sdk';
import { getClaudeClient, VOLUME_MODEL } from '../../lib/claude';
import { computeQualification } from './scoring';
import type { LeadProject, Qualification, TurnClassification } from '../../types/leads';

export interface ConversationTurn {
  direction: 'inbound' | 'outbound';
  body: string;
}

export type QualifyResult =
  | {
      ok: true;
      project: LeadProject;
      qualification: Qualification;
      classification: TurnClassification;
    }
  | { ok: false; reason: 'llm_error' | 'invalid_output' };

const EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    project_type: { type: 'string', enum: ['buy', 'sell', 'rent', 'invest', 'unknown'] },
    budget_min: { type: ['number', 'null'] },
    budget_max: { type: ['number', 'null'] },
    financing: { type: 'string', enum: ['cash', 'loan_approved', 'loan_pending', 'unknown'] },
    timeline_months: { type: ['number', 'null'] },
    areas: { type: 'array', items: { type: 'string' } },
    classification: { type: 'string', enum: ['in_scenario', 'out_of_scenario'] },
  },
  required: [
    'project_type',
    'budget_min',
    'budget_max',
    'financing',
    'timeline_months',
    'areas',
    'classification',
  ],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `Tu analyses la conversation entre un prospect immobilier et l'assistant d'une agence (France/Belgique/Suisse/Luxembourg).
Extrais les informations de qualification exprimées par le prospect. N'invente rien : utilise "unknown" ou null quand l'information n'a pas été donnée.
Classifie aussi le DERNIER message du prospect :
- "in_scenario" : il répond aux questions de qualification ou de prise de rendez-vous (projet, budget, financement, délai, secteur, choix de créneau).
- "out_of_scenario" : tout le reste — question juridique ou technique, négociation, réclamation, demande de parler à un humain, message ambigu.
En cas de doute, choisis "out_of_scenario".`;

export async function qualifyLead(turns: ConversationTurn[]): Promise<QualifyResult> {
  const transcript = turns
    .map((t) => `${t.direction === 'inbound' ? 'Prospect' : 'Assistant'}: ${t.body}`)
    .join('\n');

  let raw: string;
  try {
    const response = await getClaudeClient().messages.create({
      model: VOLUME_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      output_config: { format: { type: 'json_schema', schema: EXTRACTION_SCHEMA } },
      messages: [{ role: 'user', content: transcript }],
    });
    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === 'text',
    );
    if (!textBlock) return { ok: false, reason: 'invalid_output' };
    raw = textBlock.text;
  } catch (error) {
    if (error instanceof Anthropic.APIError || error instanceof Anthropic.APIConnectionError) {
      return { ok: false, reason: 'llm_error' };
    }
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'invalid_output' };
  }
  const extraction = parsed as {
    project_type: LeadProject['type'];
    budget_min: number | null;
    budget_max: number | null;
    financing: LeadProject['financing'];
    timeline_months: number | null;
    areas: string[];
    classification: TurnClassification;
  };

  const project: LeadProject = {
    type: extraction.project_type,
    budgetMin: extraction.budget_min ?? undefined,
    budgetMax: extraction.budget_max ?? undefined,
    financing: extraction.financing,
    timelineMonths: extraction.timeline_months ?? undefined,
    areas: extraction.areas,
  };

  return {
    ok: true,
    project,
    qualification: computeQualification(project),
    classification: extraction.classification,
  };
}
