"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type JourKey = "lun" | "mar" | "mer" | "jeu" | "ven" | "sam" | "dim";
const JOURS: { key: JourKey; label: string; defautOuvert: boolean }[] = [
  { key: "lun", label: "Lundi", defautOuvert: true },
  { key: "mar", label: "Mardi", defautOuvert: true },
  { key: "mer", label: "Mercredi", defautOuvert: true },
  { key: "jeu", label: "Jeudi", defautOuvert: true },
  { key: "ven", label: "Vendredi", defautOuvert: true },
  { key: "sam", label: "Samedi", defautOuvert: false },
  { key: "dim", label: "Dimanche", defautOuvert: false },
];

interface EtatJour {
  ouvert: boolean;
  debut: string;
  fin: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [nom, setNom] = useState("");
  const [metier, setMetier] = useState("plomberie_chauffage");
  const [telephone, setTelephone] = useState("");
  const [zone, setZone] = useState("");
  const [horaires, setHoraires] = useState<Record<JourKey, EtatJour>>(
    Object.fromEntries(
      JOURS.map((j) => [
        j.key,
        { ouvert: j.defautOuvert, debut: "08:00", fin: "18:00" },
      ]),
    ) as Record<JourKey, EtatJour>,
  );
  const [erreur, setErreur] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Garde : il faut être connecté, et pas déjà onboardé.
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const { data: u } = await supabase
        .from("utilisateurs")
        .select("entreprise_id")
        .eq("id", user.id)
        .maybeSingle();
      if (u?.entreprise_id) {
        router.replace("/dashboard");
        return;
      }
      setChecking(false);
    })();
  }, [router]);

  function majJour(key: JourKey, patch: Partial<EtatJour>) {
    setHoraires((h) => ({ ...h, [key]: { ...h[key], ...patch } }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setLoading(true);
    const supabase = createClient();

    const zoneArr = zone
      .split(/[\s,;]+/)
      .map((z) => z.trim())
      .filter(Boolean);

    const horairesJson = Object.fromEntries(
      JOURS.map((j) => {
        const e = horaires[j.key];
        return [j.key, e.ouvert ? [e.debut, e.fin] : null];
      }),
    );

    try {
      const { error } = await supabase.rpc("onboard_entreprise", {
        p_nom: nom,
        p_metier: metier,
        p_telephone: telephone,
        p_zone: zoneArr,
        p_horaires: horairesJson,
      });
      if (error) throw error;
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center text-balia-ink/50">
        Chargement…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black/[0.02] px-6 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-balia-ink">
          Configurons votre agent
        </h1>
        <p className="mt-1 text-balia-ink/60">
          Trois minutes, une fois. Ces réglages pilotent la prise de rendez-vous.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-6 rounded-2xl bg-white border border-black/5 p-6"
        >
          <div>
            <label className="block text-sm font-medium text-balia-ink/70">
              Nom de l'entreprise
            </label>
            <input
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-balia"
              placeholder="Plomberie Karim"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-balia-ink/70">
                Métier
              </label>
              <select
                value={metier}
                onChange={(e) => setMetier(e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-balia bg-white"
              >
                <option value="plomberie_chauffage">Plomberie / Chauffage</option>
                <option value="plomberie">Plomberie</option>
                <option value="chauffage">Chauffage</option>
                <option value="electricite">Électricité</option>
                <option value="serrurerie">Serrurerie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-balia-ink/70">
                Téléphone
              </label>
              <input
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-balia"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-balia-ink/70">
              Zone d'intervention (codes postaux)
            </label>
            <input
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-balia"
              placeholder="75011, 75012, 93100"
            />
            <p className="mt-1 text-xs text-balia-ink/40">
              Séparez par des virgules ou des espaces.
            </p>
          </div>

          <div>
            <span className="block text-sm font-medium text-balia-ink/70">
              Horaires d'ouverture
            </span>
            <div className="mt-2 space-y-2">
              {JOURS.map((j) => {
                const e = horaires[j.key];
                return (
                  <div key={j.key} className="flex items-center gap-3">
                    <label className="flex items-center gap-2 w-32">
                      <input
                        type="checkbox"
                        checked={e.ouvert}
                        onChange={(ev) =>
                          majJour(j.key, { ouvert: ev.target.checked })
                        }
                      />
                      <span className="text-sm text-balia-ink">{j.label}</span>
                    </label>
                    <input
                      type="time"
                      value={e.debut}
                      disabled={!e.ouvert}
                      onChange={(ev) => majJour(j.key, { debut: ev.target.value })}
                      className="rounded border border-black/10 px-2 py-1 text-sm disabled:opacity-40"
                    />
                    <span className="text-balia-ink/40">→</span>
                    <input
                      type="time"
                      value={e.fin}
                      disabled={!e.ouvert}
                      onChange={(ev) => majJour(j.key, { fin: ev.target.value })}
                      className="rounded border border-black/10 px-2 py-1 text-sm disabled:opacity-40"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {erreur && (
            <p className="text-sm text-red-600" role="alert">
              {erreur}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-balia px-4 py-2.5 text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Création…" : "Créer mon espace"}
          </button>
        </form>
      </div>
    </main>
  );
}
