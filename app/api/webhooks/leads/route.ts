// Point d'entrée des leads (portails, formulaire site — spec §6).
// MVP : crée le lead, applique la machine à états, et — mode 'manual' par
// défaut — met le premier contact en file de validation au lieu de l'envoyer.

import { NextResponse } from 'next/server';
import { decideNextAction } from '../../../../agents/leads/stateMachine';
import { addApproval, addLead, listLeads } from '../../../../lib/store';
import type { Channel } from '../../../../types/leads';

interface IncomingLead {
  displayName: string;
  channel: Channel;
  source: string;
  message: string;
  dedupeKey?: string; // téléphone/email haché côté appelant — jamais de PII en clair ici
}

const CHANNELS: Channel[] = ['sms', 'whatsapp', 'email'];

export async function POST(request: Request) {
  let input: IncomingLead;
  try {
    input = (await request.json()) as IncomingLead;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (
    typeof input.displayName !== 'string' || input.displayName.trim() === '' ||
    !CHANNELS.includes(input.channel) ||
    typeof input.source !== 'string' || input.source.trim() === '' ||
    typeof input.message !== 'string' || input.message.trim() === ''
  ) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  // Dédoublonnage naïf du MVP (clé fournie par l'appelant, déjà pseudonymisée).
  const isDuplicate =
    !!input.dedupeKey && listLeads().some((l) => l.id === input.dedupeKey);

  const transition = decideNextAction(
    { status: 'new', optedOut: false, followupsSent: 0, autonomyLevel: 'manual' },
    { type: 'lead_created', isDuplicate },
  );

  if (transition.nextStatus === 'duplicate') {
    return NextResponse.json({ status: 'duplicate' }, { status: 200 });
  }

  const lead = addLead({
    displayName: input.displayName.trim().slice(0, 60),
    channel: input.channel,
    source: input.source.trim().slice(0, 40),
    status: 'new',
    project: { type: 'unknown', financing: 'unknown', areas: [] },
    conversation: [
      { direction: 'inbound', body: input.message.trim().slice(0, 2000), at: new Date().toISOString() },
    ],
  });

  if (transition.action.type === 'draft_for_approval') {
    addApproval({
      kind: 'message',
      leadId: lead.id,
      title: `Premier contact — ${lead.displayName} (${lead.channel})`,
      proposedBody:
        'Bonjour, merci pour votre message ! Pour bien vous orienter : quel est votre projet (achat, vente, location), et dans quel secteur ?',
      context:
        'Nouveau lead entrant. Mode validation activé : Balia a préparé le premier message, à vous de valider.',
    });
  }

  console.log(`[audit] lead:${lead.id} created -> ${transition.action.type}`);
  return NextResponse.json({ leadId: lead.id, action: transition.action.type }, { status: 201 });
}
