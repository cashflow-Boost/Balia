'use client';

// La « carte de résultat » — le motif fondateur du produit (brief §4) :
// Balia fait → la carte apparaît → l'humain valide d'un geste.
// ✅ Valider · ✏️ Ajuster (édite puis envoie) · ❌ Rejeter (motif obligatoire).

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ApprovalItem } from '../types/approvals';

const KIND_LABEL: Record<ApprovalItem['kind'], string> = {
  message: 'Message sortant',
  meeting: 'Prise de RDV',
  annonce: 'Annonce à publier',
};

export function ResultCard({ item }: { item: ApprovalItem }) {
  const router = useRouter();
  const [mode, setMode] = useState<'view' | 'edit' | 'reject'>('view');
  const [body, setBody] = useState(item.proposedBody);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: 'approved' | 'edited' | 'rejected') {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/approvals/${item.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          editedBody: decision === 'edited' ? body : undefined,
          rejectReason: decision === 'rejected' ? reason : undefined,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch {
      setError('La décision n’a pas pu être enregistrée. Réessayez.');
      setBusy(false);
    }
  }

  return (
    <article className="card">
      <div className="card-head">
        <span className="badge accent">{KIND_LABEL[item.kind]}</span>
        <span className="card-title">{item.title}</span>
        <span className="card-when">{new Date(item.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <p className="card-context">{item.context}</p>

      {mode === 'edit' ? (
        <textarea value={body} onChange={(e) => setBody(e.target.value)} disabled={busy} />
      ) : (
        <div className="card-body">{body}</div>
      )}

      {mode === 'reject' && (
        <textarea
          placeholder="Motif du rejet (obligatoire — il sert à améliorer le scénario)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={busy}
        />
      )}

      <div className="card-actions">
        {mode === 'view' && (
          <>
            <button className="primary" disabled={busy} onClick={() => decide('approved')}>
              ✅ Valider et envoyer
            </button>
            <button disabled={busy} onClick={() => setMode('edit')}>✏️ Ajuster</button>
            <button className="danger" disabled={busy} onClick={() => setMode('reject')}>❌ Rejeter</button>
          </>
        )}
        {mode === 'edit' && (
          <>
            <button className="primary" disabled={busy || body.trim() === ''} onClick={() => decide('edited')}>
              ✅ Envoyer la version ajustée
            </button>
            <button disabled={busy} onClick={() => { setBody(item.proposedBody); setMode('view'); }}>
              Annuler
            </button>
          </>
        )}
        {mode === 'reject' && (
          <>
            <button className="danger" disabled={busy || reason.trim() === ''} onClick={() => decide('rejected')}>
              ❌ Confirmer le rejet
            </button>
            <button disabled={busy} onClick={() => setMode('view')}>Annuler</button>
          </>
        )}
      </div>
      {error && <p className="card-context" style={{ color: 'var(--danger)' }}>{error}</p>}
    </article>
  );
}
