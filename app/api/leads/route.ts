import { NextResponse } from "next/server";
import { z } from "zod";
import { qualifyLead, fallbackQualification } from "@/agents/leadQualification";
import { audit } from "@/lib/audit";
import { newCard } from "@/lib/cards";
import { getStore } from "@/lib/store";
import type { Lead } from "@/types";

const LeadInput = z.object({
  name: z.string().min(1).max(200),
  channel: z.enum(["email", "sms", "whatsapp", "phone"]),
  contact: z.string().min(3).max(200),
  message: z.string().min(1).max(5000),
  source: z.string().min(1).max(200).default("formulaire"),
  projectType: z
    .enum(["achat", "vente", "location", "estimation", "autre"])
    .optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  let parsed;
  try {
    parsed = LeadInput.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Entrée invalide" }, { status: 400 });
  }

  const store = getStore();
  const lead: Lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...parsed,
  };
  await store.createLead(lead);
  await audit("lead.received", lead.id, `source ${lead.source}`);

  // L'agent qualifie ; en cas d'erreur IA on retombe sur la qualification
  // simulée plutôt que de perdre le lead (problème n°1, Tome 2.3).
  let qualification;
  let degraded = false;
  try {
    qualification = await qualifyLead(lead);
  } catch {
    qualification = fallbackQualification(lead);
    degraded = true;
    await audit("agent.fallback", lead.id, "qualification IA en échec");
  }

  const card = newCard({
    kind: "lead_reply",
    title: `Réponse au lead — ${lead.name}`,
    sourceId: lead.id,
    payload: { kind: "lead_reply", qualification, channel: lead.channel },
  });
  await store.createCard(card);
  await audit("card.created", card.id, `lead_reply (segment ${qualification.segment})`);

  return NextResponse.json({ card, degraded }, { status: 201 });
}
