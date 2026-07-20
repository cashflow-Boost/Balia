import Link from "next/link";

const FEATURES = [
  {
    title: "Leads qualifiés en minutes",
    text: "Chaque contact entrant est analysé, scoré et reçoit une proposition de réponse et de rendez-vous — vous validez d'un geste.",
  },
  {
    title: "Annonces prêtes à diffuser",
    text: "Une saisie du bien, une annonce optimisée, la multidiffusion préparée pour SeLoger, LeBonCoin et BienIci.",
  },
  {
    title: "L'humain garde la décision",
    text: "Tout acte qui sort de la structure — email, SMS, publication — exige votre validation. Journal d'audit intégral.",
  },
  {
    title: "RGPD dès le départ",
    text: "Données confiées explicitement, hébergement UE, aucune PII dans les journaux. La confiance est un produit.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero container">
        <div className="badge">France · Belgique · Suisse · Luxembourg</div>
        <h1>Le système d&apos;exploitation IA de l&apos;immobilier</h1>
        <p>
          Balia fait le travail répétitif à votre place, et fait performer
          chaque collaborateur comme votre meilleur élément. Vous parlez, Balia
          fait, vous validez d&apos;un geste.
        </p>
        <Link href="/dashboard" className="cta">
          Ouvrir le poste de pilotage
        </Link>
      </section>
      <section className="features container">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature">
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
