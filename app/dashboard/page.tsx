"use client";

// Poste de pilotage (Bible, Tome 5) : entrées à gauche, cartes de résultat
// à droite. Le flux : tu saisis → Balia fait → carte → tu valides d'un geste.

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { LeadForm } from "@/components/LeadForm";
import { ResultCardView } from "@/components/ResultCardView";
import type { ResultCard } from "@/types";

export default function Dashboard() {
  const [cards, setCards] = useState<ResultCard[]>([]);
  const [tab, setTab] = useState<"lead" | "announcement">("lead");
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cards");
      if (res.ok) {
        const json = (await res.json()) as { cards: ResultCard[] };
        setCards(json.cards);
      }
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onAction = useCallback(
    async (id: string, action: "validate" | "reject", editedText?: string) => {
      await fetch(`/api/cards/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, editedText }),
      });
      await refresh();
    },
    [refresh],
  );

  return (
    <main>
      <div className="topbar">
        <div className="container">
          <Link href="/" className="brand">
            Balia<span>.</span>
          </Link>
          <span className="card-meta">Poste de pilotage</span>
        </div>
      </div>

      <div className="container dashboard">
        <aside className="panel">
          <h2>Nouvelle tâche</h2>
          <div className="tabs">
            <button
              className={`tab ${tab === "lead" ? "active" : ""}`}
              onClick={() => setTab("lead")}
            >
              Lead entrant
            </button>
            <button
              className={`tab ${tab === "announcement" ? "active" : ""}`}
              onClick={() => setTab("announcement")}
            >
              Annonce
            </button>
          </div>
          {tab === "lead" ? (
            <LeadForm onCreated={refresh} />
          ) : (
            <AnnouncementForm onCreated={refresh} />
          )}
        </aside>

        <section>
          <div className="notice">
            Tout acte sortant (réponse au lead, publication d&apos;annonce)
            n&apos;est exécuté qu&apos;après votre validation. Journal
            d&apos;audit complet, sans données personnelles.
          </div>
          <div className="card-feed">
            {cards.map((card) => (
              <ResultCardView key={card.id} card={card} onAction={onAction} />
            ))}
            {loaded && cards.length === 0 && (
              <p className="empty">
                Aucune carte pour l&apos;instant. Traitez un premier lead — la
                première victoire visible arrive en quelques secondes.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
