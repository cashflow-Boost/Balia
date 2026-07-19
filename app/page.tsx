// Tableau de bord — la file de validation d'abord (le geste unique),
// puis le pipeline de leads avec score et raisons.

import { ResultCard } from '../components/ResultCard';
import { listLeads, listPendingApprovals } from '../lib/store';
import type { Lead } from '../types/approvals';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  new: 'Nouveau',
  contacted: 'Contacté',
  qualifying: 'En qualification',
  qualified: 'Qualifié',
  disqualified: 'Non qualifié',
  meeting_proposed: 'RDV proposé',
  meeting_confirmed: 'RDV confirmé',
  handed_off: 'Transmis',
  awaiting_human: '⚠ Attend un humain',
  unresponsive: 'Sans réponse',
  duplicate: 'Doublon',
};

function TierBadge({ lead }: { lead: Lead }) {
  const q = lead.qualification;
  if (!q) return <span className="badge">—</span>;
  const label = q.tier === 'hot' ? 'Chaud' : q.tier === 'warm' ? 'Tiède' : 'Froid';
  return <span className={`badge ${q.tier}`}>{label} · {q.score}</span>;
}

export default function DashboardPage() {
  const approvals = listPendingApprovals();
  const leads = listLeads();

  return (
    <main>
      <h1 className="section-title">À valider</h1>
      <p className="section-hint">
        Balia a fait le travail. Rien ne sort de l’agence sans votre geste.
      </p>
      {approvals.length === 0 ? (
        <div className="empty">Rien en attente — Balia vous préviendra dès qu’une carte arrive.</div>
      ) : (
        approvals.map((item) => <ResultCard key={item.id} item={item} />)
      )}

      <h2 className="section-title">Leads</h2>
      <p className="section-hint">Capture → qualification → RDV, 24/7. Le score est un outil interne, jamais montré au prospect.</p>
      <table className="leads">
        <thead>
          <tr>
            <th>Contact</th>
            <th>Canal / source</th>
            <th>Statut</th>
            <th>Qualification</th>
            <th>Dernier message</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const last = lead.conversation[lead.conversation.length - 1];
            return (
              <tr key={lead.id}>
                <td><strong>{lead.displayName}</strong></td>
                <td>{lead.channel} · {lead.source}</td>
                <td>{STATUS_LABEL[lead.status] ?? lead.status}</td>
                <td>
                  <TierBadge lead={lead} />
                  {lead.qualification && (
                    <div className="reasons">{lead.qualification.reasons.slice(0, 3).join(' · ')}</div>
                  )}
                </td>
                <td className="reasons">{last ? `« ${truncate(last.body, 90)} »` : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
