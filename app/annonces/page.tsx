'use client';

// Génération d'annonces (MVP) : l'agent décrit le bien, Balia rédige,
// le brouillon part dans la file de validation — jamais publié directement.

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnnoncePage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/annonces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: data.get('kind'),
          city: data.get('city'),
          surfaceM2: Number(data.get('surfaceM2')),
          rooms: Number(data.get('rooms')),
          price: Number(data.get('price')),
          highlights: data.get('highlights') ?? '',
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setDone(true);
    } catch {
      setError("La génération a échoué. Réessayez.");
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main>
        <h1 className="section-title">Annonce rédigée ✅</h1>
        <div className="notice">
          Le brouillon est dans votre file de validation. Relisez-le, ajustez-le si besoin, puis
          validez d’un geste — rien n’est publié sans vous.
        </div>
        <button className="primary" onClick={() => router.push('/')}>Voir la carte de résultat</button>
      </main>
    );
  }

  return (
    <main>
      <h1 className="section-title">Nouvelle annonce</h1>
      <p className="section-hint">
        Décrivez le bien, Balia rédige. Vous validez avant toute publication.
      </p>
      <form className="annonce" onSubmit={onSubmit}>
        <div className="row">
          <label>
            Type de bien
            <select name="kind" defaultValue="appartement">
              <option value="appartement">Appartement</option>
              <option value="maison">Maison</option>
              <option value="terrain">Terrain</option>
              <option value="local">Local commercial</option>
            </select>
          </label>
          <label>
            Ville
            <input name="city" required placeholder="Lyon 6e" />
          </label>
        </div>
        <div className="row">
          <label>
            Surface (m²)
            <input name="surfaceM2" type="number" min="1" required placeholder="72" />
          </label>
          <label>
            Pièces
            <input name="rooms" type="number" min="1" required placeholder="3" />
          </label>
        </div>
        <label>
          Prix (€)
          <input name="price" type="number" min="1" required placeholder="380000" />
        </label>
        <label>
          Points forts (dictez comme sur le terrain)
          <textarea
            name="highlights"
            rows={3}
            placeholder="Balcon sud, refait à neuf en 2024, proche métro Foch…"
          />
        </label>
        <div>
          <button className="primary" type="submit" disabled={busy}>
            {busy ? 'Balia rédige…' : 'Rédiger l’annonce'}
          </button>
        </div>
      </form>
      {error && <p className="section-hint" style={{ color: 'var(--danger)' }}>{error}</p>}
    </main>
  );
}
