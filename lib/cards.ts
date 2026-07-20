// Machine à états de la carte de résultat : draft → validated | rejected.
// Un acte sortant ne part JAMAIS depuis un autre état que "validated".

import type { CardStatus, ResultCard } from "@/types";

const TRANSITIONS: Record<CardStatus, CardStatus[]> = {
  draft: ["validated", "rejected"],
  validated: [],
  rejected: [],
};

export function canTransition(from: CardStatus, to: CardStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function transitionCard(card: ResultCard, to: CardStatus): ResultCard {
  if (!canTransition(card.status, to)) {
    throw new Error(`Transition interdite : ${card.status} → ${to}`);
  }
  return { ...card, status: to, updatedAt: new Date().toISOString() };
}

export function newCard(
  input: Omit<ResultCard, "id" | "createdAt" | "updatedAt" | "status">,
): ResultCard {
  const now = new Date().toISOString();
  return {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: "draft",
  };
}
