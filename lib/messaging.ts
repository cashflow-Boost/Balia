// Couche d'envoi de messages — C'EST ICI que le garde-fou human-in-the-loop
// est appliqué (spec §6, défense en profondeur). Aucun autre chemin d'envoi.
// Un message part uniquement si :
//   - il vient du scénario pré-approuvé (template dont le hash correspond), OU
//   - il a été explicitement approuvé par un humain.
// Refus systématique après opt-out, et hors horaires pour les relances.

import { createHash } from 'node:crypto';

export interface OutboundMessage {
  body: string;
  sentBy: 'balia_scenario' | 'balia_draft' | 'human';
  templateKey?: string;
  approvalStatus?: 'pending' | 'approved' | 'edited' | 'rejected' | 'expired';
  isFollowup: boolean;
}

export interface RecipientContext {
  optedOut: boolean;
  localHour: number; // heure locale du prospect, 0-23
}

// Templates du scénario approuvés par la structure, indexés par clé → hash du contenu.
export type ApprovedTemplates = ReadonlyMap<string, string>;

export interface Transport {
  deliver(body: string): Promise<{ providerRef: string }>;
}

export type SendOutcome =
  | { sent: true; providerRef: string }
  | { sent: false; refusedBecause: string };

export function templateHash(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

const QUIET_HOUR_START = 21; // jamais de relance entre 21h et 8h (spec §4)
const QUIET_HOUR_END = 8;

function isQuietHour(localHour: number): boolean {
  return localHour >= QUIET_HOUR_START || localHour < QUIET_HOUR_END;
}

function isAuthorized(message: OutboundMessage, templates: ApprovedTemplates): string | null {
  if (message.sentBy === 'human') return null;
  if (message.approvalStatus === 'approved' || message.approvalStatus === 'edited') return null;
  if (message.sentBy === 'balia_scenario') {
    if (!message.templateKey) return 'scenario_message_without_template';
    const approvedHash = templates.get(message.templateKey);
    if (!approvedHash) return 'unknown_template';
    if (approvedHash !== templateHash(message.body)) return 'template_hash_mismatch';
    return null;
  }
  return 'draft_not_approved';
}

export async function sendMessage(
  message: OutboundMessage,
  recipient: RecipientContext,
  templates: ApprovedTemplates,
  transport: Transport,
): Promise<SendOutcome> {
  if (recipient.optedOut) {
    return { sent: false, refusedBecause: 'opted_out' };
  }
  if (message.isFollowup && isQuietHour(recipient.localHour)) {
    return { sent: false, refusedBecause: 'quiet_hours' };
  }
  const refusal = isAuthorized(message, templates);
  if (refusal) {
    return { sent: false, refusedBecause: refusal };
  }
  const { providerRef } = await transport.deliver(message.body);
  return { sent: true, providerRef };
}
