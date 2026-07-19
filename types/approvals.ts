// La file de validation — le motif fondateur « carte de résultat + validation ».
// Tout acte qui sort de la structure passe par ici (garde-fou §5).

import type { Channel, Qualification, LeadProject } from './leads';

export type ApprovalKind = 'message' | 'meeting' | 'annonce';

export type ApprovalStatus = 'pending' | 'approved' | 'edited' | 'rejected';

export interface ApprovalItem {
  id: string;
  kind: ApprovalKind;
  leadId?: string;
  title: string; // ex: « Réponse à Camille D. (WhatsApp) »
  proposedBody: string; // le contenu que Balia propose d'envoyer / publier
  context: string; // pourquoi Balia propose ça (visible sur la carte)
  status: ApprovalStatus;
  createdAt: string;
  decidedAt?: string;
  rejectReason?: string;
}

export interface ConversationMessage {
  direction: 'inbound' | 'outbound';
  body: string;
  at: string;
}

export interface Lead {
  id: string;
  displayName: string; // prénom + initiale — jamais de PII complète côté UI liste
  channel: Channel;
  source: string;
  status: string;
  createdAt: string;
  project: LeadProject;
  qualification?: Qualification;
  conversation: ConversationMessage[];
}
