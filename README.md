# Balia

**L'employé IA du dépannage à domicile.** Balia décroche le téléphone à la
place de l'artisan, qualifie l'appel, pose le rendez-vous et prouve le CA
récupéré. Promesse : _« Ne ratez plus jamais un client. »_

Les documents fondateurs sont dans [`balia/`](balia/) :

- [`balia/BIBLE.md`](balia/BIBLE.md) — Bible produit v1.0 (28 tomes + annexes).
- [`balia/RUNBOOK.md`](balia/RUNBOOK.md) — runbook du sprint MVP 3 jours.

## Stack

Next.js 14 (App Router) · Supabase (région UE) · Tailwind CSS · Vercel · Twilio
+ Vapi/Retell (pipeline vocal) · Claude (cerveau de l'agent) · Stripe (abo).

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # puis renseigne tes clés (voir ci-dessous)
npm run dev                  # http://localhost:3000
```

Le tableau de bord (`/dashboard`) fonctionne **sans Supabase** en _mode démo_
(chiffres fictifs). Dès que tu renseignes `NEXT_PUBLIC_SUPABASE_URL` et
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, il lit tes vraies données.

## Base de données (Supabase)

Le schéma (BIBLE Tome 13) est dans [`supabase/migrations/`](supabase/migrations/) :

- `0001_init.sql` — tables `entreprises`, `utilisateurs`, `appels`,
  `clients_finaux`, `rendez_vous`, `devis`, `relances`, `messages`,
  `abonnements`.
- `0002_rls.sql` — Row Level Security : cloisonnement strict par entreprise.

Applique-les via le SQL Editor de Supabase (crée le projet en **région UE** —
RGPD, Tome 22) ou via la CLI `supabase db push`.

## Variables d'environnement

Voir [`.env.example`](.env.example). **Ne jamais committer `.env.local`** — les
clés vivent dans les variables d'environnement (Vercel : Settings → Environment
Variables). La clé `SUPABASE_SERVICE_ROLE_KEY` est réservée au serveur (webhooks
vocaux, jobs de relance).

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | Lint Next.js |

## État du build (sprint 3 jours)

- [x] **Jour 1 — squelette** : app Next.js déployable sur Vercel, schéma
      Supabase (Tome 13) + RLS, landing (messaging Tome 21), dashboard « CA
      récupéré » (Tome 24.6) en mode démo.
- [ ] Jour 1 — agent vocal (Vapi/Retell + numéro Twilio + prompt Tome 28).
- [ ] Jour 2 — qualification → écriture `appels`, prise de créneau, SMS de
      confirmation, dashboard sur données réelles.
- [ ] Jour 3 — logo & couleurs, onboarding, domaine `balia.fr`, Stripe.
