"use client";

import { useState, type FormEvent } from "react";

export function AnnouncementForm({ onCreated }: { onCreated: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError("");
    try {
      const priceRaw = String(data.get("price") ?? "").trim();
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: data.get("kind"),
          city: data.get("city"),
          surfaceM2: Number(data.get("surfaceM2")),
          rooms: Number(data.get("rooms")),
          price: priceRaw ? Number(priceRaw) : undefined,
          highlights: data.get("highlights"),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      onCreated();
    } catch {
      setError("Échec de la génération d'annonce — réessayez.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <label htmlFor="a-kind">Type de bien</label>
      <input id="a-kind" name="kind" required placeholder="Appartement" />

      <label htmlFor="a-city">Ville</label>
      <input id="a-city" name="city" required placeholder="Lyon 6e" />

      <label htmlFor="a-surface">Surface (m²)</label>
      <input id="a-surface" name="surfaceM2" type="number" min="1" required />

      <label htmlFor="a-rooms">Nombre de pièces</label>
      <input id="a-rooms" name="rooms" type="number" min="1" required />

      <label htmlFor="a-price">Prix (€, optionnel)</label>
      <input id="a-price" name="price" type="number" min="1" />

      <label htmlFor="a-highlights">Atouts du bien</label>
      <textarea
        id="a-highlights"
        name="highlights"
        required
        placeholder="Balcon sud, refait à neuf, proche métro Foch…"
      />

      <button className="btn btn-primary" disabled={busy}>
        {busy ? "Balia rédige l'annonce…" : "Générer l'annonce"}
      </button>
      {error && <p className="outcome">{error}</p>}
    </form>
  );
}
