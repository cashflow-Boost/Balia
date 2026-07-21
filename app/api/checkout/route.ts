import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPlan } from "@/lib/plans";

export const dynamic = "force-dynamic";

/**
 * POST /api/checkout  { plan: "solo" | "pro" | "pme" }
 *
 * Crée une session Stripe Checkout (abonnement mensuel) avec essai 14 jours
 * sans carte (Tome 17.2). Prix défini en ligne (price_data) : pas besoin de
 * pré-créer les produits dans Stripe. Dégrade proprement si Stripe n'est pas
 * configuré.
 */
export async function POST(req: Request) {
  // 1. Valider la requête d'abord (400 indépendamment de la config Stripe).
  let body: { plan?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const plan = getPlan(body.plan ?? "");
  if (!plan) {
    return NextResponse.json({ error: "Palier inconnu" }, { status: 400 });
  }

  // 2. Vérifier la config Stripe (503 si absente).
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe non configuré", skipped: true },
      { status: 503 },
    );
  }

  const stripe = new Stripe(secret);
  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: plan.prixMensuel * 100,
            recurring: { interval: "month" },
            product_data: {
              name: `Balia ${plan.nom}`,
              description: plan.cible,
            },
          },
        },
      ],
      // Essai 14 jours sans carte bancaire (Tome 17.2).
      subscription_data: { trial_period_days: 14 },
      payment_method_collection: "if_required",
      success_url: `${origin}/dashboard?abonnement=ok`,
      cancel_url: `${origin}/tarifs`,
      metadata: { plan: plan.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur Stripe" },
      { status: 500 },
    );
  }
}
