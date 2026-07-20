import { NextResponse } from "next/server";
import { z } from "zod";
import {
  generateAnnouncement,
  fallbackAnnouncement,
} from "@/agents/announcement";
import { audit } from "@/lib/audit";
import { newCard } from "@/lib/cards";
import { getStore } from "@/lib/store";

const PropertyInputSchema = z.object({
  kind: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  surfaceM2: z.number().positive().max(100000),
  rooms: z.number().int().positive().max(100),
  price: z.number().positive().optional(),
  highlights: z.string().min(1).max(2000),
});

export async function POST(request: Request): Promise<NextResponse> {
  let property;
  try {
    property = PropertyInputSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Entrée invalide" }, { status: 400 });
  }

  const store = getStore();
  const propertyId = crypto.randomUUID();

  let announcement;
  let degraded = false;
  try {
    announcement = await generateAnnouncement(property);
  } catch {
    announcement = fallbackAnnouncement(property);
    degraded = true;
    await audit("agent.fallback", propertyId, "rédaction IA en échec");
  }

  const card = newCard({
    kind: "announcement",
    title: `Annonce — ${property.kind} à ${property.city}`,
    sourceId: propertyId,
    payload: { kind: "announcement", announcement, property },
  });
  await store.createCard(card);
  await audit("card.created", card.id, "announcement");

  return NextResponse.json({ card, degraded }, { status: 201 });
}
