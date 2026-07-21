// Types métier Balia — miroir du schéma SQL (BIBLE Tome 13).

export type Plan = "solo" | "pro" | "pme";
export type StatutEntreprise = "trial" | "actif" | "suspendu" | "churn";

export type ModeAppel = "debordement" | "hors_horaire" | "complet";
export type ResultatAppel =
  | "rdv_pris"
  | "qualifie"
  | "transfere"
  | "hors_perimetre"
  | "perdu";
export type Urgence = "immediat" | "jour" | "semaine" | "programme";

export type StatutRdv =
  | "confirme"
  | "annule"
  | "reporte"
  | "realise"
  | "no_show";

export type StatutDevis =
  | "brouillon"
  | "envoye"
  | "vu"
  | "signe"
  | "refuse"
  | "perdu";

export interface Entreprise {
  id: string;
  nom: string;
  metier: string;
  telephone_principal: string | null;
  numero_balia: string | null;
  email: string | null;
  plan: Plan;
  statut: StatutEntreprise;
  date_creation: string;
}

export interface Appel {
  id: string;
  entreprise_id: string;
  numero_appelant: string | null;
  date_appel: string;
  duree_secondes: number | null;
  mode: ModeAppel | null;
  resultat: ResultatAppel | null;
  urgence: Urgence | null;
  ca_estime: number | null;
  transfere: boolean;
}

export interface RendezVous {
  id: string;
  entreprise_id: string;
  client_id: string | null;
  date_debut: string | null;
  date_fin: string | null;
  type: string | null;
  statut: StatutRdv;
  adresse: string | null;
  description: string | null;
}
