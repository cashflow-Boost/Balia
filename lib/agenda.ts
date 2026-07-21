// Logique d'agenda Balia — génération de créneaux libres (BIBLE Tome 8).
// Règles : ne jamais double-booker, respecter les horaires d'ouverture,
// appliquer un temps de trajet (tampon) entre interventions (Tome 8.8).
//
// ⚠️ Fuseau horaire : dans ce squelette les heures d'ouverture sont
// interprétées en UTC de façon *cohérente* (candidats et RDV existants
// comparés dans le même référentiel). À remplacer par Europe/Paris via une
// lib de timezone avant la prod (Tome 23.3).

export type JourSemaine = "dim" | "lun" | "mar" | "mer" | "jeu" | "ven" | "sam";

export const JOURS: JourSemaine[] = [
  "dim",
  "lun",
  "mar",
  "mer",
  "jeu",
  "ven",
  "sam",
];

/** Horaires d'ouverture : plage [ouverture, fermeture] par jour, ou null. */
export type Horaires = Partial<Record<JourSemaine, [string, string] | null>>;

export interface Creneau {
  debut: string; // ISO
  fin: string; // ISO
}

export interface RdvOccupe {
  date_debut: string;
  date_fin: string | null;
}

/** Horaires par défaut si l'entreprise n'a rien configuré : lun–ven 8h–18h. */
const HORAIRES_DEFAUT: Horaires = {
  lun: ["08:00", "18:00"],
  mar: ["08:00", "18:00"],
  mer: ["08:00", "18:00"],
  jeu: ["08:00", "18:00"],
  ven: ["08:00", "18:00"],
  sam: null,
  dim: null,
};

function minutesDepuisHHMM(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + (m || 0);
}

function dateAvecMinutes(jour: Date, minutes: number): Date {
  const d = new Date(
    Date.UTC(
      jour.getUTCFullYear(),
      jour.getUTCMonth(),
      jour.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
  d.setUTCMinutes(minutes);
  return d;
}

function chevauche(
  debut: Date,
  fin: Date,
  occupes: RdvOccupe[],
  tamponMs: number,
  dureeParDefautMs: number,
): boolean {
  const dMs = debut.getTime();
  const fMs = fin.getTime();
  for (const occ of occupes) {
    const oDebut = new Date(occ.date_debut).getTime();
    if (Number.isNaN(oDebut)) continue;
    const oFin = occ.date_fin
      ? new Date(occ.date_fin).getTime()
      : oDebut + dureeParDefautMs;
    // Conflit si les intervalles se recouvrent, tampon inclus de part et d'autre.
    if (dMs < oFin + tamponMs && fMs + tamponMs > oDebut) return true;
  }
  return false;
}

export interface OptionsCreneaux {
  horaires?: Horaires | null;
  rdvOccupes?: RdvOccupe[];
  dureeMinutes?: number; // durée d'un créneau (défaut 120)
  tamponMinutes?: number; // temps de trajet entre interventions (défaut 30)
  joursAvenir?: number; // horizon de recherche (défaut 14)
  limite?: number; // nb de créneaux à proposer (défaut 2 — Tome 7.9)
  maintenant?: Date; // injectable pour les tests
}

/**
 * Génère les prochains créneaux libres respectant les horaires et les RDV
 * existants. Retourne au plus `limite` créneaux (2 par défaut : la règle d'or
 * « toujours proposer deux créneaux concrets », Tome 7.9).
 */
export function genererCreneaux(opts: OptionsCreneaux = {}): Creneau[] {
  const horaires = opts.horaires ?? HORAIRES_DEFAUT;
  const occupes = opts.rdvOccupes ?? [];
  const dureeMinutes = opts.dureeMinutes ?? 120;
  const tamponMinutes = opts.tamponMinutes ?? 30;
  const joursAvenir = opts.joursAvenir ?? 14;
  const limite = opts.limite ?? 2;
  const now = opts.maintenant ?? new Date();

  const dureeMs = dureeMinutes * 60_000;
  const tamponMs = tamponMinutes * 60_000;
  const resultats: Creneau[] = [];

  for (let d = 0; d <= joursAvenir; d++) {
    const jour = new Date(now.getTime());
    jour.setUTCDate(now.getUTCDate() + d);
    const cle = JOURS[jour.getUTCDay()];
    const plage = horaires[cle];
    if (!plage) continue;

    const ouverture = minutesDepuisHHMM(plage[0]);
    const fermeture = minutesDepuisHHMM(plage[1]);

    for (
      let start = ouverture;
      start + dureeMinutes <= fermeture;
      start += dureeMinutes
    ) {
      const debut = dateAvecMinutes(jour, start);
      const fin = new Date(debut.getTime() + dureeMs);

      if (debut.getTime() <= now.getTime()) continue; // pas de créneau passé
      if (chevauche(debut, fin, occupes, tamponMs, dureeMs)) continue;

      resultats.push({ debut: debut.toISOString(), fin: fin.toISOString() });
      if (resultats.length >= limite) return resultats;
    }
  }

  return resultats;
}

const fmtCreneau = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

/** Libellé lisible d'un créneau, pour que l'agent vocal l'annonce. */
export function libelleCreneau(c: Creneau): string {
  return fmtCreneau.format(new Date(c.debut));
}
