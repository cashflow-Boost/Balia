import { describe, expect, it } from "vitest";
import { canTransition, newCard, transitionCard } from "@/lib/cards";
import { fallbackQualification } from "@/agents/leadQualification";
import { fallbackAnnouncement } from "@/agents/announcement";
import type { Lead } from "@/types";

const lead: Lead = {
  id: "00000000-0000-0000-0000-000000000001",
  createdAt: new Date().toISOString(),
  name: "Test",
  channel: "email",
  contact: "test@example.com",
  message: "Je souhaite vendre mon appartement rapidement",
  source: "test",
  projectType: "vente",
};

function draftCard() {
  return newCard({
    kind: "lead_reply",
    title: "Test",
    sourceId: lead.id,
    payload: {
      kind: "lead_reply",
      qualification: fallbackQualification(lead),
      channel: "email",
    },
  });
}

describe("machine à états de la carte de résultat", () => {
  it("crée les cartes en brouillon", () => {
    expect(draftCard().status).toBe("draft");
  });

  it("autorise draft → validated et draft → rejected", () => {
    expect(transitionCard(draftCard(), "validated").status).toBe("validated");
    expect(transitionCard(draftCard(), "rejected").status).toBe("rejected");
  });

  it("interdit toute transition depuis un état terminal", () => {
    const validated = transitionCard(draftCard(), "validated");
    expect(() => transitionCard(validated, "rejected")).toThrow();
    expect(canTransition("validated", "validated")).toBe(false);
    expect(canTransition("rejected", "validated")).toBe(false);
  });
});

describe("fallbacks des agents (mode démo)", () => {
  it("qualifie un lead à intention forte comme chaud", () => {
    const q = fallbackQualification(lead);
    expect(q.segment).toBe("chaud");
    expect(q.score).toBeGreaterThan(50);
    expect(q.proposedReply).toContain(lead.name);
    expect(q.proposedSlots.length).toBeGreaterThan(0);
  });

  it("génère une annonce complète depuis les données du bien", () => {
    const a = fallbackAnnouncement({
      kind: "Appartement",
      city: "Lyon",
      surfaceM2: 72,
      rooms: 3,
      price: 350000,
      highlights: "Balcon sud.",
    });
    expect(a.title).toContain("Lyon");
    expect(a.body).toContain("350");
    expect(a.portals.length).toBeGreaterThan(0);
  });
});
