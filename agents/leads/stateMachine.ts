// Machine à états du lead — fonction pure, sans I/O (spec §4, §6).
// Toute transition est décidée ici ; l'orchestrateur exécute l'action retournée
// et écrit la transition dans l'audit log.

import type { LeadEvent, LeadState, LeadTransition } from '../../types/leads';

const MAX_FOLLOWUPS = 2; // J+1 puis J+3

export function decideNextAction(state: LeadState, event: LeadEvent): LeadTransition {
  // Garde-fous transverses, prioritaires sur tout le reste.
  if (event.type === 'opt_out') {
    return { nextStatus: state.status, action: { type: 'stop_all', reason: 'opt_out' } };
  }
  if (state.optedOut) {
    return { nextStatus: state.status, action: { type: 'none' } };
  }
  if (event.type === 'human_requested') {
    return {
      nextStatus: 'awaiting_human',
      action: { type: 'escalate_to_human', reason: 'prospect_requested_human' },
    };
  }
  if (event.type === 'provider_error') {
    // Jamais d'échec silencieux : un humain reprend la main.
    return {
      nextStatus: 'awaiting_human',
      action: { type: 'escalate_to_human', reason: 'provider_error' },
    };
  }

  // Mode 'manual' : tout message sortant passe par la validation, même le premier contact.
  const firstContactAction = (): LeadTransition['action'] =>
    state.autonomyLevel === 'scenario'
      ? { type: 'send_scenario_message', templateKey: 'first_contact' }
      : { type: 'draft_for_approval', reason: 'manual_autonomy_level' };

  switch (event.type) {
    case 'lead_created':
      if (event.isDuplicate) {
        return { nextStatus: 'duplicate', action: { type: 'merge_duplicate' } };
      }
      return { nextStatus: 'contacted', action: firstContactAction() };

    case 'inbound_message':
      // Sortie de scénario → fail-closed : brouillon + validation, quel que soit l'état.
      if (event.classification === 'out_of_scenario') {
        return {
          nextStatus: 'awaiting_human',
          action: { type: 'draft_for_approval', reason: 'out_of_scenario' },
        };
      }
      if (state.status === 'awaiting_human') {
        // L'agent est suspendu : seul un humain peut relancer le flux.
        return { nextStatus: 'awaiting_human', action: { type: 'none' } };
      }
      if (state.status === 'meeting_proposed') {
        return { nextStatus: 'meeting_proposed', action: { type: 'run_qualification' } };
      }
      return { nextStatus: 'qualifying', action: { type: 'run_qualification' } };

    case 'qualification_completed':
      if (event.tier === 'cold') {
        // Clôture courtoise par template — jamais de silence (spec §4).
        return {
          nextStatus: 'disqualified',
          action:
            state.autonomyLevel === 'scenario'
              ? { type: 'send_scenario_message', templateKey: 'polite_close' }
              : { type: 'draft_for_approval', reason: 'manual_autonomy_level' },
        };
      }
      return { nextStatus: 'qualified', action: { type: 'propose_slots' } };

    case 'slots_available':
      if (event.count === 0) {
        // Pas d'invention de créneau : carte "agenda plein" au collaborateur.
        return {
          nextStatus: 'qualified',
          action: { type: 'escalate_to_human', reason: 'no_slots_available' },
        };
      }
      return {
        nextStatus: 'meeting_proposed',
        action:
          state.autonomyLevel === 'scenario'
            ? { type: 'send_scenario_message', templateKey: 'propose_slots' }
            : { type: 'draft_for_approval', reason: 'manual_autonomy_level' },
      };

    case 'slot_accepted':
      return { nextStatus: 'meeting_confirmed', action: { type: 'confirm_meeting' } };

    case 'slot_declined':
      return { nextStatus: 'qualified', action: { type: 'propose_slots' } };

    case 'no_reply_timeout':
      if (state.followupsSent >= MAX_FOLLOWUPS) {
        return { nextStatus: 'unresponsive', action: { type: 'none' } };
      }
      return {
        nextStatus: state.status,
        action: { type: 'schedule_followup', attempt: state.followupsSent + 1 },
      };

    case 'human_validated':
      return { nextStatus: 'handed_off', action: { type: 'hand_off' } };

    case 'human_rejected':
      return { nextStatus: 'awaiting_human', action: { type: 'none' } };
  }
}
