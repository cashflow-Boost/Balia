"use client";

// La carte de résultat — unité de base de l'interface (Bible, Tome 7).
// Un seul geste pour tout le produit : valider, éditer ou rejeter.

import { useState } from "react";
import type { ResultCard } from "@/types";

const STATUS_LABEL: Record<ResultCard["status"], string> = {
  draft: "À valider",
  validated: "Validée",
  rejected: "Rejetée",
};

export function ResultCardView({
  card,
  onAction,
}: {
  card: ResultCard;
  onAction: (id: string, action: "validate" | "reject", editedText?: string) => Promise<void>;
}) {
  const initialText =
    card.payload.kind === "lead_reply"
      ? card.payload.qualification.proposedReply
      : card.payload.announcement.body;
  const [text, setText] = useState(initialText);
  const [busy, setBusy] = useState(false);

  const act = async (action: "validate" | "reject") => {
    setBusy(true);
    try {
      await onAction(card.id, action, text !== initialText ? text : undefined);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="result-card">
      <header>
        <h3>{card.title}</h3>
        <span className={`status status-${card.status}`}>
          {STATUS_LABEL[card.status]}
        </span>
      </header>

      {card.payload.kind === "lead_reply" ? (
        <p className="card-meta">
          Score {card.payload.qualification.score}/100 · segment{" "}
          {card.payload.qualification.segment} · canal {card.payload.channel}
          <br />
          {card.payload.qualification.summary}
          <br />
          Créneaux proposés : {card.payload.qualification.proposedSlots.join(" · ")}
        </p>
      ) : (
        <p className="card-meta">
          {card.payload.announcement.title}
          <br />
          Diffusion préparée : {card.payload.announcement.portals.join(", ")}
        </p>
      )}

      <div className="card-body">
        {card.status === "draft" ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Contenu proposé par Balia"
          />
        ) : (
          text
        )}
      </div>

      {card.status === "draft" && (
        <div className="card-actions">
          <button
            className="btn btn-validate"
            disabled={busy}
            onClick={() => act("validate")}
          >
            Valider et envoyer
          </button>
          <button
            className="btn btn-reject"
            disabled={busy}
            onClick={() => act("reject")}
          >
            Rejeter
          </button>
        </div>
      )}

      {card.outcome && <p className="outcome">{card.outcome}</p>}
    </article>
  );
}
