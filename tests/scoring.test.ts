import { describe, expect, it } from 'vitest';
import { computeQualification } from '../agents/leads/scoring';
import type { LeadProject } from '../types/leads';

const project = (over: Partial<LeadProject> = {}): LeadProject => ({
  type: 'unknown',
  financing: 'unknown',
  areas: [],
  ...over,
});

describe('computeQualification', () => {
  it('prospect complet et financé → hot', () => {
    const q = computeQualification(
      project({
        type: 'buy',
        budgetMax: 350_000,
        financing: 'loan_approved',
        timelineMonths: 2,
        areas: ['Lyon 6e'],
      }),
    );
    expect(q.score).toBe(100);
    expect(q.tier).toBe('hot');
  });

  it('prospect partiel → warm', () => {
    const q = computeQualification(
      project({ type: 'buy', budgetMax: 200_000, financing: 'loan_pending' }),
    );
    expect(q.tier).toBe('warm');
  });

  it('prospect vide → cold', () => {
    const q = computeQualification(project());
    expect(q.score).toBe(0);
    expect(q.tier).toBe('cold');
  });

  it('le score est toujours accompagné de raisons', () => {
    const q = computeQualification(project({ type: 'sell' }));
    expect(q.reasons.length).toBeGreaterThan(0);
    expect(q.reasons).toContain('projet identifié (sell)');
  });

  it('délai long ne rapporte rien', () => {
    const short = computeQualification(project({ timelineMonths: 2 }));
    const long = computeQualification(project({ timelineMonths: 24 }));
    expect(short.score).toBeGreaterThan(long.score);
  });
});
