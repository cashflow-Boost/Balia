import Link from "next/link";

// Landing minimale — messaging BIBLE Tome 21.
// Promesse de marque : « Ne ratez plus jamais un client. »
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-black/5">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <span className="text-2xl font-bold tracking-tight text-balia">
            Balia
          </span>
          <nav className="flex items-center gap-6">
            <Link
              href="/tarifs"
              className="text-sm font-medium text-balia-ink/70 hover:text-balia-ink"
            >
              Tarifs
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-balia-ink/70 hover:text-balia-ink"
            >
              Se connecter →
            </Link>
          </nav>
        </div>
      </header>

      <section className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-balia-accent">
            L'employé IA du dépannage à domicile
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-tight text-balia-ink max-w-2xl">
            Ne ratez plus jamais un client.
          </h1>
          <p className="mt-6 text-lg text-balia-ink/70 max-w-xl">
            Balia décroche le téléphone à votre place 24h/24, comprend le
            problème, prend le rendez-vous dans votre agenda et envoie le devis.
            Vous êtes sur le chantier, Balia s'occupe des appels.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/login"
              className="rounded-lg bg-balia px-5 py-3 text-white font-medium hover:opacity-90"
            >
              Essai gratuit — 48h pour être live
            </Link>
            <Link
              href="/tarifs"
              className="rounded-lg border border-black/10 px-5 py-3 font-medium text-balia-ink hover:bg-black/5"
            >
              Voir les tarifs
            </Link>
          </div>

          <div
            id="comment"
            className="mt-20 grid gap-8 sm:grid-cols-3 border-t border-black/5 pt-12"
          >
            {[
              {
                t: "Il décroche",
                d: "En débordement ou 24/7, l'agent prend l'appel que vous ne pouvez pas prendre.",
              },
              {
                t: "Il qualifie & pose le RDV",
                d: "Nature du problème, urgence, zone — puis un créneau ferme dans l'agenda.",
              },
              {
                t: "Il prouve le CA récupéré",
                d: "Le tableau de bord affiche, en euros, le chiffre d'affaires que Balia vous a sauvé.",
              },
            ].map((f) => (
              <div key={f.t}>
                <h3 className="font-semibold text-balia-ink">{f.t}</h3>
                <p className="mt-2 text-sm text-balia-ink/60">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5">
        <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-balia-ink/50">
          Balia — l'assistant qui décroche pour les artisans. Données hébergées
          en UE (RGPD).
        </div>
      </footer>
    </main>
  );
}
