"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS, type PlanId } from "@/lib/plans";

export default function TarifsPage() {
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function choisir(plan: PlanId) {
    setLoading(plan);
    setNote(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.status === 503) {
        // Stripe pas encore branché : on bascule sur l'essai gratuit.
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setNote(data.error ?? "Impossible de démarrer le paiement.");
      }
    } catch {
      setNote("Une erreur est survenue.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-black/[0.02]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-balia">
            Balia
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-balia-ink/70 hover:text-balia-ink"
          >
            Se connecter →
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-balia-ink">
            Un employé qui vous rapporte plus qu'il ne coûte.
          </h1>
          <p className="mt-4 text-balia-ink/60 max-w-2xl mx-auto">
            Si Balia vous récupère ne serait-ce qu'un client par semaine, il est
            déjà rentabilisé plusieurs fois. Essai 14 jours, sans carte
            bancaire, sans engagement.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl bg-white p-6 border ${
                plan.populaire
                  ? "border-balia ring-2 ring-balia/20"
                  : "border-black/5"
              }`}
            >
              {plan.populaire && (
                <span className="inline-block rounded-full bg-balia px-3 py-1 text-xs font-medium text-white">
                  Le plus populaire
                </span>
              )}
              <h2 className="mt-3 text-lg font-semibold text-balia-ink">
                {plan.nom}
              </h2>
              <p className="text-sm text-balia-ink/50">{plan.cible}</p>
              <p className="mt-4">
                <span className="text-4xl font-bold text-balia-ink">
                  {plan.prixMensuel} €
                </span>
                <span className="text-balia-ink/50"> / mois</span>
              </p>

              <button
                onClick={() => choisir(plan.id)}
                disabled={loading !== null}
                className={`mt-6 w-full rounded-lg px-4 py-2.5 font-medium disabled:opacity-50 ${
                  plan.populaire
                    ? "bg-balia text-white hover:opacity-90"
                    : "border border-black/10 text-balia-ink hover:bg-black/5"
                }`}
              >
                {loading === plan.id
                  ? "…"
                  : `Essai gratuit — ${plan.nom}`}
              </button>

              <ul className="mt-6 space-y-2">
                {plan.inclus.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-balia-ink/70"
                  >
                    <span className="text-balia mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {note && (
          <p className="mt-8 text-center text-sm text-red-600" role="alert">
            {note}
          </p>
        )}

        <p className="mt-10 text-center text-sm text-balia-ink/40">
          Sans commission sur votre chiffre d'affaires. Annuel = 2 mois offerts.
          Garantie satisfait ou remboursé 30 jours.
        </p>
      </div>
    </main>
  );
}
