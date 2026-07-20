"use client";

import { useState, type FormEvent } from "react";

export function LeadForm({ onCreated }: { onCreated: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          channel: data.get("channel"),
          contact: data.get("contact"),
          message: data.get("message"),
          source: data.get("source") || "formulaire",
          projectType: data.get("projectType") || undefined,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      onCreated();
    } catch {
      setError("Échec du traitement du lead — réessayez.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <label htmlFor="lead-name">Nom du contact</label>
      <input id="lead-name" name="name" required placeholder="Marie Dupont" />

      <label htmlFor="lead-contact">Email ou téléphone</label>
      <input
        id="lead-contact"
        name="contact"
        required
        placeholder="marie@exemple.fr"
      />

      <label htmlFor="lead-channel">Canal de réponse</label>
      <select id="lead-channel" name="channel" defaultValue="email">
        <option value="email">Email</option>
        <option value="sms">SMS</option>
        <option value="whatsapp">WhatsApp</option>
        <option value="phone">Téléphone</option>
      </select>

      <label htmlFor="lead-project">Type de projet</label>
      <select id="lead-project" name="projectType" defaultValue="achat">
        <option value="achat">Achat</option>
        <option value="vente">Vente</option>
        <option value="location">Location</option>
        <option value="estimation">Estimation</option>
        <option value="autre">Autre</option>
      </select>

      <label htmlFor="lead-source">Source</label>
      <input id="lead-source" name="source" placeholder="SeLoger, site, appel…" />

      <label htmlFor="lead-message">Message du contact</label>
      <textarea
        id="lead-message"
        name="message"
        required
        placeholder="Bonjour, je cherche un T3 à Lyon avec balcon…"
      />

      <button className="btn btn-primary" disabled={busy}>
        {busy ? "Balia qualifie le lead…" : "Traiter ce lead"}
      </button>
      {error && <p className="outcome">{error}</p>}
    </form>
  );
}
