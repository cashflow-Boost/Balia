import Link from "next/link";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/lib/dashboard";
import type { ResultatAppel, Urgence } from "@/lib/types";

export const dynamic = "force-dynamic";

function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Vérifie la session et l'onboarding. Retourne le nom de l'entreprise, ou
 * redirige vers /login (non connecté) ou /onboarding (pas encore configuré).
 * En preview sans Supabase, on saute l'auth et on montre le mode démo.
 */
async function requireArtisan(): Promise<string | null> {
  if (!supabaseConfigured()) return null;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: u } = await supabase
    .from("utilisateurs")
    .select("entreprise_id")
    .eq("id", user.id)
    .maybeSingle();
  if (!u?.entreprise_id) redirect("/onboarding");

  const { data: ent } = await supabase
    .from("entreprises")
    .select("nom")
    .eq("id", u.entreprise_id)
    .maybeSingle();

  return ent?.nom ?? null;
}

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const heure = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

const jourHeure = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const resultatLabel: Record<ResultatAppel, string> = {
  rdv_pris: "RDV pris",
  qualifie: "Qualifié",
  transfere: "Transféré",
  hors_perimetre: "Hors périmètre",
  perdu: "Perdu",
};

const urgenceLabel: Record<Urgence, string> = {
  immediat: "Immédiat",
  jour: "Aujourd'hui",
  semaine: "Cette semaine",
  programme: "Programmé",
};

export default async function Dashboard() {
  const entrepriseNom = await requireArtisan();
  const stats = await getDashboardStats();

  return (
    <main className="min-h-screen bg-black/[0.02]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <Link href="/" className="text-xl font-bold text-balia">
              Balia
            </Link>
            {entrepriseNom && (
              <span className="text-sm text-balia-ink/60">{entrepriseNom}</span>
            )}
          </div>
          {supabaseConfigured() ? (
            <form action="/auth/signout" method="post">
              <button className="text-sm text-balia-ink/50 hover:text-balia-ink">
                Se déconnecter
              </button>
            </form>
          ) : (
            <span className="text-sm text-balia-ink/50">Tableau de bord</span>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {stats.demo && (
          <div className="mb-6 rounded-lg border border-balia-accent/30 bg-balia-accent/10 px-4 py-3 text-sm text-balia-ink/70">
            <strong>Mode démo.</strong> Supabase n'est pas encore branché — ces
            chiffres sont fictifs. Renseigne tes clés dans{" "}
            <code>.env.local</code> pour afficher tes vrais appels.
          </div>
        )}

        {/* CA récupéré — le chiffre roi (Tome 24.6) */}
        <section className="rounded-2xl bg-balia text-white p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-white/70">
            CA récupéré ce mois-ci
          </p>
          <p className="mt-2 text-5xl sm:text-6xl font-bold">
            {euro.format(stats.caRecupere)}
          </p>
          <p className="mt-3 text-white/70">
            Grâce aux appels captés par Balia que vous auriez manqués.
          </p>
        </section>

        {/* Compteurs secondaires */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Appels captés" value={stats.appelsCaptes} />
          <StatCard label="RDV posés" value={stats.rdvPoses} />
          <StatCard label="Devis signés" value={stats.devisSignes} />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Derniers appels */}
          <section className="rounded-xl bg-white border border-black/5 p-6">
            <h2 className="font-semibold text-balia-ink">Derniers appels</h2>
            <ul className="mt-4 divide-y divide-black/5">
              {stats.derniersAppels.map((a) => (
                <li
                  key={a.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-balia-ink truncate">
                      {a.numero_appelant ?? "Numéro inconnu"}
                    </p>
                    <p className="text-xs text-balia-ink/50">
                      {heure.format(new Date(a.date_appel))}
                      {a.urgence ? ` · ${urgenceLabel[a.urgence]}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block rounded-full bg-balia/10 px-2.5 py-0.5 text-xs font-medium text-balia">
                      {a.resultat ? resultatLabel[a.resultat] : "—"}
                    </span>
                    {a.ca_estime ? (
                      <p className="mt-1 text-xs text-balia-ink/50">
                        {euro.format(a.ca_estime)}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
              {stats.derniersAppels.length === 0 && (
                <li className="py-6 text-sm text-balia-ink/40">
                  Aucun appel capté pour l'instant.
                </li>
              )}
            </ul>
          </section>

          {/* Prochains RDV */}
          <section className="rounded-xl bg-white border border-black/5 p-6">
            <h2 className="font-semibold text-balia-ink">Prochains rendez-vous</h2>
            <ul className="mt-4 divide-y divide-black/5">
              {stats.prochainsRdv.map((r) => (
                <li key={r.id} className="py-3">
                  <p className="text-sm font-medium text-balia-ink">
                    {r.description ?? "Intervention"}
                  </p>
                  <p className="text-xs text-balia-ink/50">
                    {r.date_debut
                      ? jourHeure.format(new Date(r.date_debut))
                      : "Date à confirmer"}
                    {r.adresse ? ` · ${r.adresse}` : ""}
                  </p>
                </li>
              ))}
              {stats.prochainsRdv.length === 0 && (
                <li className="py-6 text-sm text-balia-ink/40">
                  Aucun rendez-vous à venir.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white border border-black/5 p-6">
      <p className="text-sm text-balia-ink/50">{label}</p>
      <p className="mt-1 text-3xl font-bold text-balia-ink">{value}</p>
    </div>
  );
}
