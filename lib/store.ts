// Stockage en mémoire du MVP, avec données de démonstration.
// Interface volontairement plate pour être remplacée par Supabase (RLS)
// sans toucher aux pages ni aux agents — voir docs/specs/agent-leads-mvp.md §5.

import { randomUUID } from 'node:crypto';
import { computeQualification } from '../agents/leads/scoring';
import type { ApprovalItem, Lead } from '../types/approvals';

interface Store {
  leads: Map<string, Lead>;
  approvals: Map<string, ApprovalItem>;
}

// `globalThis` pour survivre au rechargement à chaud de Next en dev.
const g = globalThis as typeof globalThis & { __baliaStore?: Store };

function seed(): Store {
  const leads = new Map<string, Lead>();
  const approvals = new Map<string, ApprovalItem>();
  const now = Date.now();
  const iso = (minAgo: number) => new Date(now - minAgo * 60_000).toISOString();

  const camille: Lead = {
    id: 'lead-demo-1',
    displayName: 'Camille D.',
    channel: 'whatsapp',
    source: 'seloger',
    status: 'qualified',
    createdAt: iso(42),
    project: {
      type: 'buy',
      budgetMax: 380_000,
      financing: 'loan_approved',
      timelineMonths: 3,
      areas: ['Lyon 6e', 'Villeurbanne'],
    },
    conversation: [
      { direction: 'inbound', body: 'Bonjour, je suis intéressée par le T3 rue Vendôme.', at: iso(42) },
      { direction: 'outbound', body: 'Bonjour, merci pour votre message ! Pour bien vous orienter : votre projet est-il un achat pour y habiter ?', at: iso(41) },
      { direction: 'inbound', body: 'Oui, résidence principale. Budget 380 000 €, prêt accordé. Idéalement sous 3 mois, sur Lyon 6 ou Villeurbanne.', at: iso(35) },
    ],
  };
  camille.qualification = computeQualification(camille.project);

  const marc: Lead = {
    id: 'lead-demo-2',
    displayName: 'Marc T.',
    channel: 'sms',
    source: 'leboncoin',
    status: 'awaiting_human',
    createdAt: iso(18),
    project: { type: 'buy', financing: 'unknown', areas: [] },
    conversation: [
      { direction: 'inbound', body: 'Bonjour, la maison de Caluire est-elle en zone inondable ? Et le DPE est-il opposable ?', at: iso(18) },
    ],
  };

  const sofia: Lead = {
    id: 'lead-demo-3',
    displayName: 'Sofia R.',
    channel: 'email',
    source: 'website',
    status: 'contacted',
    createdAt: iso(6),
    project: { type: 'sell', financing: 'unknown', areas: ['Caluire-et-Cuire'] },
    conversation: [
      { direction: 'inbound', body: 'Je souhaite faire estimer ma maison à Caluire avant une mise en vente.', at: iso(6) },
      { direction: 'outbound', body: 'Bonjour, merci pour votre demande ! Quelques questions pour préparer votre estimation…', at: iso(5) },
    ],
  };

  leads.set(camille.id, camille);
  leads.set(marc.id, marc);
  leads.set(sofia.id, sofia);

  const a1: ApprovalItem = {
    id: 'appr-demo-1',
    kind: 'meeting',
    leadId: camille.id,
    title: 'RDV visite — Camille D. (WhatsApp)',
    proposedBody:
      'Parfait, tout est bon de mon côté ! Je vous propose une visite du T3 rue Vendôme : jeudi 17h30 ou samedi 10h00. Laquelle vous convient ?',
    context:
      'Lead qualifié hot (score 100) : achat résidence principale, 380 k€, prêt accordé, délai < 3 mois. Deux créneaux libres trouvés dans votre agenda.',
    status: 'pending',
    createdAt: iso(30),
  };
  const a2: ApprovalItem = {
    id: 'appr-demo-2',
    kind: 'message',
    leadId: marc.id,
    title: 'Réponse hors scénario — Marc T. (SMS)',
    proposedBody:
      "Bonjour, bonnes questions ! La maison n'est pas classée en zone inondable au PPRI en vigueur, et oui, le DPE est opposable depuis 2021. Je peux vous transmettre les documents — souhaitez-vous une visite ?",
    context:
      'Question juridique détectée (hors scénario) : Balia a préparé une réponse mais ne l’enverra pas sans votre validation.',
    status: 'pending',
    createdAt: iso(15),
  };
  approvals.set(a1.id, a1);
  approvals.set(a2.id, a2);

  return { leads, approvals };
}

function store(): Store {
  if (!g.__baliaStore) g.__baliaStore = seed();
  return g.__baliaStore;
}

export function listLeads(): Lead[] {
  return [...store().leads.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getLead(id: string): Lead | undefined {
  return store().leads.get(id);
}

export function addLead(lead: Omit<Lead, 'id' | 'createdAt'>): Lead {
  const full: Lead = { ...lead, id: randomUUID(), createdAt: new Date().toISOString() };
  store().leads.set(full.id, full);
  return full;
}

export function listPendingApprovals(): ApprovalItem[] {
  return [...store().approvals.values()]
    .filter((a) => a.status === 'pending')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function addApproval(item: Omit<ApprovalItem, 'id' | 'createdAt' | 'status'>): ApprovalItem {
  const full: ApprovalItem = {
    ...item,
    id: randomUUID(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  store().approvals.set(full.id, full);
  return full;
}

export function decideApproval(
  id: string,
  decision: 'approved' | 'rejected' | 'edited',
  options: { editedBody?: string; rejectReason?: string } = {},
): ApprovalItem | undefined {
  const item = store().approvals.get(id);
  if (!item || item.status !== 'pending') return undefined; // verrou : première décision gagne
  item.status = decision;
  item.decidedAt = new Date().toISOString();
  if (decision === 'edited' && options.editedBody) item.proposedBody = options.editedBody;
  if (decision === 'rejected') item.rejectReason = options.rejectReason ?? 'non précisé';
  return item;
}
