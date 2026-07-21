// Grille tarifaire Balia — source : BIBLE Tome 17.2.
// Abonnement + outcome, zéro commission sur le CA. Essai 14 j sans CB.

export type PlanId = "solo" | "pro" | "pme";

export interface Plan {
  id: PlanId;
  nom: string;
  prixMensuel: number; // en euros
  cible: string;
  populaire?: boolean;
  inclus: string[];
}

export const PLANS: Plan[] = [
  {
    id: "solo",
    nom: "Solo",
    prixMensuel: 149,
    cible: "Artisan seul",
    inclus: [
      "Débordement + hors-horaires",
      "Qualification des appels",
      "Relance des devis",
      "1 canal vocal",
      "Quota d'appels de base",
    ],
  },
  {
    id: "pro",
    nom: "Pro",
    prixMensuel: 349,
    cible: "TPE de 2 à 10",
    populaire: true,
    inclus: [
      "Agent vocal 24/7",
      "Multicanal (appel / SMS / WhatsApp)",
      "RDV dans l'agenda",
      "Devis automatiques",
      "Relances + dashboard CA récupéré",
      "Quota d'appels étendu",
    ],
  },
  {
    id: "pme",
    nom: "PME",
    prixMensuel: 599,
    cible: "10 à 20 personnes",
    inclus: [
      "Multi-techniciens",
      "Multi-lignes",
      "Priorité de traitement",
      "Analytics avancés",
      "Quota d'appels élevé",
    ],
  },
];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
