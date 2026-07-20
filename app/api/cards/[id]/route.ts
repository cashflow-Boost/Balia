import { NextResponse } from "next/server";
import { z } from "zod";
import { audit } from "@/lib/audit";
import { transitionCard } from "@/lib/cards";
import { sendOutbound } from "@/lib/outbound";
import { getStore } from "@/lib/store";

const ActionInput = z.object({
  action: z.enum(["validate", "reject"]),
  /** Texte éventuellement édité par l'utilisateur avant validation. */
  editedText: z.string().max(10000).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  let input;
  try {
    input = ActionInput.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Entrée invalide" }, { status: 400 });
  }

  const store = getStore();
  const card = await store.getCard(id);
  if (!card) {
    return NextResponse.json({ error: "Carte introuvable" }, { status: 404 });
  }

  let updated;
  try {
    updated = transitionCard(
      card,
      input.action === "validate" ? "validated" : "rejected",
    );
  } catch {
    return NextResponse.json(
      { error: `Carte déjà ${card.status}` },
      { status: 409 },
    );
  }

  if (input.action === "reject") {
    updated.outcome = "Rejetée par l'utilisateur";
    await store.updateCard(updated);
    await audit("card.rejected", updated.id);
    return NextResponse.json({ card: updated });
  }

  // Validation : applique l'édition éventuelle puis exécute l'acte sortant.
  if (updated.payload.kind === "lead_reply") {
    if (input.editedText) {
      updated.payload.qualification.proposedReply = input.editedText;
      await audit("card.edited", updated.id);
    }
    const lead = await store.getLead(updated.sourceId);
    if (lead) {
      const result = await sendOutbound({
        cardId: updated.id,
        channel: updated.payload.channel,
        to: lead.contact,
        body: updated.payload.qualification.proposedReply,
      });
      updated.outcome = result.detail;
    } else {
      updated.outcome = "Lead source introuvable — aucun envoi";
    }
  } else {
    if (input.editedText) {
      updated.payload.announcement.body = input.editedText;
      await audit("card.edited", updated.id);
    }
    // Multidiffusion : préparée pour les portails ; la publication réelle
    // arrive avec les connecteurs (Ubiflow/Poliris). Trace d'audit en attendant.
    await audit(
      "announcement.queued",
      updated.id,
      updated.payload.announcement.portals.join(", "),
    );
    updated.outcome = `Diffusion préparée : ${updated.payload.announcement.portals.join(", ")} (connecteurs portails à venir)`;
  }

  await store.updateCard(updated);
  await audit("card.validated", updated.id);
  return NextResponse.json({ card: updated });
}
