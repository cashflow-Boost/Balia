import { describe, expect, it } from 'vitest';
import { decideNextAction } from '../agents/leads/stateMachine';
import type { LeadState } from '../types/leads';

const base = (over: Partial<LeadState> = {}): LeadState => ({
  status: 'new',
  optedOut: false,
  followupsSent: 0,
  autonomyLevel: 'scenario',
  ...over,
});

describe('decideNextAction — garde-fous transverses', () => {
  it('opt_out arrête tout, quel que soit l’état', () => {
    const t = decideNextAction(base({ status: 'qualifying' }), { type: 'opt_out' });
    expect(t.action).toEqual({ type: 'stop_all', reason: 'opt_out' });
  });

  it('aucune action après opt-out', () => {
    const t = decideNextAction(base({ optedOut: true, status: 'contacted' }), {
      type: 'no_reply_timeout',
    });
    expect(t.action.type).toBe('none');
  });

  it('demande d’humain → awaiting_human immédiat', () => {
    const t = decideNextAction(base({ status: 'qualifying' }), { type: 'human_requested' });
    expect(t.nextStatus).toBe('awaiting_human');
    expect(t.action.type).toBe('escalate_to_human');
  });

  it('panne fournisseur → jamais d’échec silencieux', () => {
    const t = decideNextAction(base({ status: 'contacted' }), { type: 'provider_error' });
    expect(t.nextStatus).toBe('awaiting_human');
  });
});

describe('decideNextAction — parcours nominal (mode scenario)', () => {
  it('nouveau lead → premier contact par template', () => {
    const t = decideNextAction(base(), { type: 'lead_created', isDuplicate: false });
    expect(t.nextStatus).toBe('contacted');
    expect(t.action).toEqual({ type: 'send_scenario_message', templateKey: 'first_contact' });
  });

  it('doublon → fusion, pas de deuxième séquence de contact', () => {
    const t = decideNextAction(base(), { type: 'lead_created', isDuplicate: true });
    expect(t.nextStatus).toBe('duplicate');
    expect(t.action.type).toBe('merge_duplicate');
  });

  it('message dans le scénario → qualification', () => {
    const t = decideNextAction(base({ status: 'contacted' }), {
      type: 'inbound_message',
      classification: 'in_scenario',
    });
    expect(t.nextStatus).toBe('qualifying');
    expect(t.action.type).toBe('run_qualification');
  });

  it('message hors scénario → fail-closed, brouillon + validation', () => {
    const t = decideNextAction(base({ status: 'qualifying' }), {
      type: 'inbound_message',
      classification: 'out_of_scenario',
    });
    expect(t.nextStatus).toBe('awaiting_human');
    expect(t.action).toEqual({ type: 'draft_for_approval', reason: 'out_of_scenario' });
  });

  it('en awaiting_human, plus aucun envoi automatique', () => {
    const t = decideNextAction(base({ status: 'awaiting_human' }), {
      type: 'inbound_message',
      classification: 'in_scenario',
    });
    expect(t.action.type).toBe('none');
  });

  it('qualifié (hot) → proposition de créneaux', () => {
    const t = decideNextAction(base({ status: 'qualifying' }), {
      type: 'qualification_completed',
      tier: 'hot',
    });
    expect(t.nextStatus).toBe('qualified');
    expect(t.action.type).toBe('propose_slots');
  });

  it('disqualifié (cold) → clôture courtoise, jamais de silence', () => {
    const t = decideNextAction(base({ status: 'qualifying' }), {
      type: 'qualification_completed',
      tier: 'cold',
    });
    expect(t.nextStatus).toBe('disqualified');
    expect(t.action).toEqual({ type: 'send_scenario_message', templateKey: 'polite_close' });
  });

  it('agenda plein → pas d’invention de créneau, escalade', () => {
    const t = decideNextAction(base({ status: 'qualified' }), {
      type: 'slots_available',
      count: 0,
    });
    expect(t.action).toEqual({ type: 'escalate_to_human', reason: 'no_slots_available' });
  });

  it('créneau accepté → RDV confirmé', () => {
    const t = decideNextAction(base({ status: 'meeting_proposed' }), { type: 'slot_accepted' });
    expect(t.nextStatus).toBe('meeting_confirmed');
    expect(t.action.type).toBe('confirm_meeting');
  });

  it('validation humaine → handed_off', () => {
    const t = decideNextAction(base({ status: 'meeting_confirmed' }), {
      type: 'human_validated',
    });
    expect(t.nextStatus).toBe('handed_off');
  });
});

describe('decideNextAction — relances', () => {
  it('première relance planifiée', () => {
    const t = decideNextAction(base({ status: 'contacted' }), { type: 'no_reply_timeout' });
    expect(t.action).toEqual({ type: 'schedule_followup', attempt: 1 });
  });

  it('après 2 relances → unresponsive, on arrête', () => {
    const t = decideNextAction(base({ status: 'contacted', followupsSent: 2 }), {
      type: 'no_reply_timeout',
    });
    expect(t.nextStatus).toBe('unresponsive');
    expect(t.action.type).toBe('none');
  });
});

describe('decideNextAction — mode manual (défaut)', () => {
  it('même le premier contact passe par la validation', () => {
    const t = decideNextAction(base({ autonomyLevel: 'manual' }), {
      type: 'lead_created',
      isDuplicate: false,
    });
    expect(t.action).toEqual({ type: 'draft_for_approval', reason: 'manual_autonomy_level' });
  });
});
