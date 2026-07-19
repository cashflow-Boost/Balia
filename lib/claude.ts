// Client Claude partagé (spec §6). Clé API en variable d'environnement uniquement.
// Modèles selon CLAUDE.md §2 : Sonnet pour le volume, Opus pour le raisonnement complexe.

import Anthropic from '@anthropic-ai/sdk';

export const VOLUME_MODEL = 'claude-sonnet-5';
export const REASONING_MODEL = 'claude-opus-4-8';

let client: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (!client) {
    // Le SDK lit ANTHROPIC_API_KEY depuis l'environnement — jamais de clé en dur.
    client = new Anthropic();
  }
  return client;
}

// Injection pour les tests (évite tout appel réseau réel).
export function setClaudeClientForTests(fake: Anthropic): void {
  client = fake;
}
