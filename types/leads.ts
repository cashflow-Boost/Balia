// Types partagés du domaine Leads (spec: docs/specs/agent-leads-mvp.md §4-5)

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualifying'
  | 'qualified'
  | 'disqualified'
  | 'meeting_proposed'
  | 'meeting_confirmed'
  | 'handed_off'
  | 'awaiting_human'
  | 'unresponsive'
  | 'duplicate';

export type Channel = 'sms' | 'whatsapp' | 'email';

export type LeadSource =
  | 'seloger'
  | 'leboncoin'
  | 'bienici'
  | 'website'
  | 'email'
  | 'sms'
  | 'whatsapp'
  | 'missed_call'
  | 'manual';

export type FinancingStatus = 'cash' | 'loan_approved' | 'loan_pending' | 'unknown';

export interface LeadProject {
  type: 'buy' | 'sell' | 'rent' | 'invest' | 'unknown';
  budgetMin?: number;
  budgetMax?: number;
  financing: FinancingStatus;
  timelineMonths?: number;
  areas: string[];
  notes?: string;
}

export type QualificationTier = 'hot' | 'warm' | 'cold';

export interface Qualification {
  score: number; // 0-100
  tier: QualificationTier;
  reasons: string[]; // toujours accompagné des raisons, jamais un score sec
}

// Classification de chaque tour de conversation (spec §2) :
// in_scenario → réponse automatique autorisée (templates pré-approuvés)
// out_of_scenario → brouillon + validation humaine, fail-closed
export type TurnClassification = 'in_scenario' | 'out_of_scenario';

export interface LeadState {
  status: LeadStatus;
  optedOut: boolean;
  followupsSent: number; // relances déjà envoyées (max 2: J+1, J+3)
  autonomyLevel: 'manual' | 'scenario'; // config par structure, défaut 'manual'
}

export type LeadEvent =
  | { type: 'lead_created'; isDuplicate: boolean }
  | { type: 'inbound_message'; classification: TurnClassification }
  | { type: 'qualification_completed'; tier: QualificationTier }
  | { type: 'slots_available'; count: number }
  | { type: 'slot_accepted' }
  | { type: 'slot_declined' }
  | { type: 'no_reply_timeout' }
  | { type: 'opt_out' }
  | { type: 'human_requested' }
  | { type: 'provider_error' }
  | { type: 'human_validated' }
  | { type: 'human_rejected' };

export type LeadAction =
  | { type: 'send_scenario_message'; templateKey: string }
  | { type: 'draft_for_approval'; reason: string }
  | { type: 'run_qualification' }
  | { type: 'propose_slots' }
  | { type: 'confirm_meeting' }
  | { type: 'schedule_followup'; attempt: number }
  | { type: 'escalate_to_human'; reason: string }
  | { type: 'stop_all'; reason: string }
  | { type: 'merge_duplicate' }
  | { type: 'hand_off' }
  | { type: 'none' };

export interface LeadTransition {
  nextStatus: LeadStatus;
  action: LeadAction;
}
