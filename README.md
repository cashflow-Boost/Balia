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
- `0003_harden_rls.sql` — durcissement : le helper `current_entreprise_id()`
  passe dans un schéma `private` non exposé par l'API.
- `0004_onboarding.sql` — RPC `onboard_entreprise` (amorçage du 1er artisan).

Ces migrations sont **déjà appliquées** sur le projet Supabase (région UE,
RGPD Tome 22). Pour un nouvel environnement, applique-les dans l'ordre via le
SQL Editor de Supabase ou la CLI `supabase db push`.

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
      Supabase (Tome 13) + RLS **appliqués sur la base UE**, landing
      (messaging Tome 21), dashboard « CA récupéré » (Tome 24.6).
- [x] **Jour 1 — agent vocal (côté code)** : webhook `/api/vocal/webhook`
      (parse Vapi/Retell), prompts agent (Tome 28). *Reste à brancher : compte
      Vapi/Retell + numéro Twilio + clé Fable 5.*
- [x] **Jour 2 — RDV + agenda + SMS** : `/api/disponibilites`,
      `/api/rendez-vous` (anti-double-booking), SMS de confirmation Twilio.
- [x] **Auth + onboarding** : Supabase Auth (login/signup), wizard
      d'onboarding (Tome 16), cloisonnement RLS par entreprise.
- [x] **Jour 3 — tarifs + Stripe** : page `/tarifs` (Tome 17, 3 paliers) +
      `/api/checkout` (abonnement mensuel, essai 14 j sans CB). Se branche dès
      que `STRIPE_SECRET_KEY` est renseignée.
- [ ] Jour 3 — logo & couleurs définitifs, domaine `balia.fr`.

### Brancher les comptes externes (côté fondateur)

Le code est prêt ; il attend les clés dans les variables d'environnement
(`.env.local` en local, Vercel en prod) :

- **Supabase** : URL + clé anon → ✅ branché. Ajouter `SUPABASE_SERVICE_ROLE_KEY`
  (Settings → API) pour activer le webhook vocal.
- **Twilio / Vapi (ou Retell)** : comptes à créer, numéro à acheter, clé
  Fable 5 à coller côté plateforme vocale, webhook → `/api/vocal/webhook`.
- **Note auth** : pour un onboarding « live en 48h » sans friction, désactive
  la confirmation e-mail dans Supabase (Auth → Providers → Email) ou garde-la
  selon ta préférence.
