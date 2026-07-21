import type { Appel, RendezVous } from "@/lib/types";

export interface DashboardStats {
  caRecupere: number;
  appelsCaptes: number;
  rdvPoses: number;
  devisSignes: number;
  derniersAppels: Appel[];
  prochainsRdv: RendezVous[];
  demo: boolean; // true tant que Supabase n'est pas configuré
}

/**
 * Données de démonstration — utilisées tant que Supabase n'est pas branché
 * (ni NEXT_PUBLIC_SUPABASE_URL, ni clé). Permet de voir le dashboard vivre
 * avant le Jour 2 du runbook.
 */
function demoStats(): DashboardStats {
  const derniersAppels: Appel[] = [
    {
      id: "demo-1",
      entreprise_id: "demo",
      numero_appelant: "+33 6 12 ** ** 08",
      date_appel: new Date(Date.now() - 3600_000).toISOString(),
      duree_secondes: 142,
      mode: "debordement",
      resultat: "rdv_pris",
      urgence: "immediat",
      ca_estime: 380,
      transfere: false,
    },
    {
      id: "demo-2",
      entreprise_id: "demo",
      numero_appelant: "+33 7 44 ** ** 91",
      date_appel: new Date(Date.now() - 7200_000).toISOString(),
      duree_secondes: 97,
      mode: "hors_horaire",
      resultat: "rdv_pris",
      urgence: "jour",
      ca_estime: 220,
      transfere: false,
    },
    {
      id: "demo-3",
      entreprise_id: "demo",
      numero_appelant: "+33 6 88 ** ** 12",
      date_appel: new Date(Date.now() - 10800_000).toISOString(),
      duree_secondes: 63,
      mode: "debordement",
      resultat: "qualifie",
      urgence: "semaine",
      ca_estime: 150,
      transfere: false,
    },
  ];

  const prochainsRdv: RendezVous[] = [
    {
      id: "demo-rdv-1",
      entreprise_id: "demo",
      client_id: "demo",
      date_debut: new Date(Date.now() + 86400_000).toISOString(),
      date_fin: new Date(Date.now() + 86400_000 + 7200_000).toISOString(),
      type: "urgence",
      statut: "confirme",
      adresse: "12 rue des Lilas, 75011",
      description: "Fuite sous évier",
    },
  ];

  return {
    caRecupere: 750,
    appelsCaptes: 3,
    rdvPoses: 2,
    devisSignes: 0,
    derniersAppels,
    prochainsRdv,
    demo: true,
  };
}

function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Récupère les stats du tableau de bord. Bascule sur les données de démo
 * tant que Supabase n'est pas configuré, pour que la page reste affichable.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  if (!supabaseConfigured()) {
    return demoStats();
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();

  const { data: appels } = await supabase
    .from("appels")
    .select("*")
    .order("date_appel", { ascending: false })
    .limit(20);

  const { data: rdv } = await supabase
    .from("rendez_vous")
    .select("*")
    .gte("date_debut", new Date().toISOString())
    .order("date_debut", { ascending: true })
    .limit(10);

  const { count: devisSignes } = await supabase
    .from("devis")
    .select("id", { count: "exact", head: true })
    .eq("statut", "signe");

  const listeAppels = (appels ?? []) as Appel[];
  const caRecupere = listeAppels
    .filter((a) => a.resultat === "rdv_pris" || a.resultat === "qualifie")
    .reduce((sum, a) => sum + (a.ca_estime ?? 0), 0);

  return {
    caRecupere,
    appelsCaptes: listeAppels.length,
    rdvPoses: listeAppels.filter((a) => a.resultat === "rdv_pris").length,
    devisSignes: devisSignes ?? 0,
    derniersAppels: listeAppels.slice(0, 5),
    prochainsRdv: (rdv ?? []) as RendezVous[],
    demo: false,
  };
}
