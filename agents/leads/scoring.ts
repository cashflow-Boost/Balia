// Scoring de qualification — fonction pure, testable (spec §5 `qualification`).
// Le score reste un outil interne d'orchestration, toujours accompagné de ses
// raisons, jamais exposé au prospect (garde-fou RGPD, spec §9).

import type { LeadProject, Qualification } from '../../types/leads';

const HOT_THRESHOLD = 70;
const WARM_THRESHOLD = 40;

export function computeQualification(project: LeadProject): Qualification {
  let score = 0;
  const reasons: string[] = [];

  // Projet identifié
  if (project.type !== 'unknown') {
    score += 20;
    reasons.push(`projet identifié (${project.type})`);
  } else {
    reasons.push('projet non identifié');
  }

  // Budget exprimé
  if (project.budgetMax !== undefined || project.budgetMin !== undefined) {
    score += 20;
    reasons.push('budget exprimé');
  } else {
    reasons.push('budget inconnu');
  }

  // Financement
  switch (project.financing) {
    case 'cash':
    case 'loan_approved':
      score += 30;
      reasons.push(`financement solide (${project.financing})`);
      break;
    case 'loan_pending':
      score += 15;
      reasons.push('financement en cours');
      break;
    case 'unknown':
      reasons.push('financement inconnu');
      break;
  }

  // Délai du projet
  if (project.timelineMonths !== undefined) {
    if (project.timelineMonths <= 3) {
      score += 20;
      reasons.push('délai court (≤ 3 mois)');
    } else if (project.timelineMonths <= 12) {
      score += 10;
      reasons.push('délai moyen (≤ 12 mois)');
    } else {
      reasons.push('délai long (> 12 mois)');
    }
  } else {
    reasons.push('délai inconnu');
  }

  // Secteur précisé
  if (project.areas.length > 0) {
    score += 10;
    reasons.push('secteur précisé');
  } else {
    reasons.push('secteur non précisé');
  }

  const tier = score >= HOT_THRESHOLD ? 'hot' : score >= WARM_THRESHOLD ? 'warm' : 'cold';
  return { score, tier, reasons };
}
