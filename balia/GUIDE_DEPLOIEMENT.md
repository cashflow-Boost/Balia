# 🚀 GUIDE DE DÉPLOIEMENT BALIA — de « code fini » à « MVP en ligne »

Ce guide te fait passer, étape par étape, du code (déjà prêt sur GitHub) à une
app **en ligne sur ton domaine**, avec l'agent vocal qui décroche pour de vrai.
Écrit pour aller vite, sans supposer que tu es développeur.

> **Ce qui est déjà fait** : tout le code, et la base de données Supabase
> (région UE) avec ses tables. Il te reste à **coller des clés** et à
> **cliquer sur « Déployer »**. Pas de code à écrire.

**Ordre conseillé :** Supabase → Vercel (mettre en ligne) → Stripe → Twilio →
Vapi → Domaine → Test final. Compte ~1 à 2 h.

---

## ⚠️ Règle d'or sur les clés

- Une clé **`NEXT_PUBLIC_...`** est publique (elle part dans le navigateur) — OK.
- Toutes les autres (`SERVICE_ROLE`, `SECRET`, `AUTH_TOKEN`…) sont **secrètes** :
  elles vont **uniquement** dans les variables d'environnement de Vercel et dans
  ton `.env.local` en local. **Jamais** dans le code, jamais sur GitHub, jamais
  collées dans un chat.

---

## 1. Supabase (base de données) — ~10 min

La base et les tables existent déjà (région UE, conforme RGPD). Tu récupères
juste les clés.

1. Va sur [supabase.com](https://supabase.com) → ton projet.
2. **Settings → API**. Note :
   - **Project URL** → variable `NEXT_PUBLIC_SUPABASE_URL`
   - **`anon` `public`** → variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **`service_role` `secret`** → variable `SUPABASE_SERVICE_ROLE_KEY`
     ⚠️ Secrète — c'est la clé qui autorise l'agent vocal à écrire les appels.
3. **(Recommandé) Onboarding sans friction** : **Authentication → Providers →
   Email** → désactive « Confirm email » si tu veux que l'artisan soit
   opérationnel immédiatement après inscription (Bible Tome 16, « live en 48h »).

> Les migrations (schéma + sécurité RLS + onboarding) sont **déjà appliquées**.
> Si un jour tu repars d'un projet Supabase vierge, applique dans l'ordre les
> fichiers de `supabase/migrations/` via le SQL Editor.

---

## 2. Vercel (mettre l'app en ligne) — ~15 min

1. Va sur [vercel.com](https://vercel.com), connecte-toi avec **GitHub**.
2. **Add New → Project** → importe le dépôt `cashflow-Boost/Balia`.
3. Vercel détecte **Next.js** tout seul. Ne touche à rien côté build.
4. **Environment Variables** — ajoute (au minimum pour démarrer) :

   | Variable | Valeur | Secrète ? |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | (étape 1) | non |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (étape 1) | non |
   | `SUPABASE_SERVICE_ROLE_KEY` | (étape 1) | **oui** |
   | `VOCAL_WEBHOOK_SECRET` | invente une longue chaîne aléatoire | **oui** |

   Les autres (`STRIPE_*`, `TWILIO_*`, `VAPI_API_KEY`) s'ajoutent aux étapes
   suivantes — tu peux redéployer à chaque ajout.
5. **Deploy**. Au bout d'une minute, tu as une URL du type
   `https://balia-xxxx.vercel.app`. **Ouvre-la** : tu vois la landing, `/tarifs`,
   et tu peux créer un compte sur `/login`.

> 💡 **`VOCAL_WEBHOOK_SECRET`** : n'importe quelle longue chaîne (ex. sortie de
> `openssl rand -hex 32`). Tu la recolleras à l'identique côté Vapi/Retell
> (étape 5) — c'est le mot de passe partagé qui protège ton webhook.

---

## 3. Stripe (abonnements) — ~15 min · optionnel au lancement

1. Crée un compte sur [stripe.com](https://stripe.com).
2. **Developers → API keys** → copie la **Secret key** (`sk_...`).
3. Dans Vercel → **Environment Variables** → ajoute `STRIPE_SECRET_KEY`
   (secrète). Redéploie.
4. C'est tout : la page `/tarifs` crée les abonnements **avec essai 14 jours
   sans carte**. Pas besoin de créer des produits — les prix (149/349/599 €)
   sont définis dans le code.

> Tant que `STRIPE_SECRET_KEY` est absente, les boutons de `/tarifs` basculent
> proprement vers l'inscription (essai gratuit). Rien ne casse.

---

## 4. Twilio (numéro + SMS) — ~20 min

1. Crée un compte sur [twilio.com](https://twilio.com).
2. **Phone Numbers → Buy a number** : prends un numéro **France** (ou mobile).
   ⚠️ Un numéro FR peut demander une pièce justificative — anticipe.
3. **Account → API keys & tokens** → note :
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN` (secret)
   - Ton numéro acheté → `TWILIO_PHONE_NUMBER` (format `+33...`)
4. Ajoute ces 3 variables dans Vercel. Redéploie.

> À ce stade, le **SMS de confirmation** part automatiquement après chaque RDV
> pris. La voix, elle, se branche à l'étape suivante via Vapi.

---

## 5. Vapi (l'agent vocal) — ~30 min · le cœur

On **ne construit pas** le pipeline vocal soi-même : Vapi (ou Retell) fait
STT + TTS + LLM sur ton numéro Twilio. Tu ne fais que le configurer.

1. Crée un compte sur [vapi.ai](https://vapi.ai).
2. **Connecte ton numéro Twilio** (Phone Numbers → Import from Twilio, avec le
   SID + Auth Token de l'étape 4).
3. **Crée un assistant** :
   - **Modèle** : Anthropic **`claude-fable-5`** (colle ta clé Anthropic Fable 5
     dans la config du modèle, côté Vapi).
   - **Prompt système** : copie le contenu de `systemPrompt()` dans le fichier
     `lib/agent/prompts.ts` du dépôt (remplace `{NOM_ENTREPRISE}` et `{ZONES}`).
   - **Voix** : une voix **française** naturelle.
4. **Outils / functions de l'assistant** (pour qu'il propose et pose un RDV) :
   - `disponibilites` → `GET https://TON-DOMAINE/api/disponibilites?entreprise_id=...&duree=120`
   - `poser_rdv` → `POST https://TON-DOMAINE/api/rendez-vous`
   - Ajoute à ces appels l'en-tête **`x-balia-secret: <VOCAL_WEBHOOK_SECRET>`**
     (la valeur de l'étape 2).
5. **Analyse post-appel** : configure la sortie structurée pour renvoyer le JSON
   du **Tome 28.4** (nature, urgence, code_postal, nom, téléphone, ca_estime,
   resultat…). Le prompt est prêt : constante `QUALIFICATION_PROMPT` dans
   `lib/agent/prompts.ts`.
6. **Webhook de fin d'appel** → `POST https://TON-DOMAINE/api/vocal/webhook`,
   avec l'en-tête **`x-balia-secret: <VOCAL_WEBHOOK_SECRET>`**. C'est ce qui
   journalise l'appel et fait monter le compteur « CA récupéré ».

> **Retell** au lieu de Vapi : même logique (assistant, numéro Twilio, clé
> Fable 5, webhook). Le code parse déjà les deux formats de payload.

---

## 6. Le domaine `balia.fr` — ~10 min (+ propagation DNS)

1. Achète `balia.fr` chez **OVHcloud** (idéal `.fr`), Cloudflare ou Namecheap.
2. Dans Vercel → ton projet → **Settings → Domains** → ajoute `balia.fr`.
3. Vercel te donne des enregistrements **DNS (A / CNAME)** → copie-les chez ton
   registrar.
4. Attends la propagation (quelques minutes à 24 h). **HTTPS automatique**.
5. **Reviens mettre à jour** les URL de webhook/outils Vapi (étape 5) avec
   `https://balia.fr/...` au lieu de l'URL `.vercel.app`.

---

## 7. Test final bout-en-bout ✅

Coche tout ça — c'est le Jalon MVP du runbook :

- [ ] J'ouvre `https://balia.fr` → la landing s'affiche, favicon visible.
- [ ] Je crée un compte sur `/login`, je remplis l'onboarding (zone, horaires).
- [ ] **J'appelle mon numéro Twilio** → l'agent décroche et parle en français.
- [ ] Je décris une panne → il qualifie, propose **2 créneaux**, en confirme un.
- [ ] Je **reçois le SMS** de confirmation.
- [ ] Dans le **dashboard**, l'appel apparaît, le RDV est là, et le compteur
      **« CA récupéré »** a augmenté.

Si les 6 cases sont vertes : **ton MVP est live.** Tu peux commencer à le montrer
à tes premiers design partners (Bible Tome 19).

---

## 🆘 En cas de souci

| Symptôme | Cause probable | Solution |
|---|---|---|
| Dashboard « Mode démo » | Clés Supabase absentes sur Vercel | Ajoute-les, redéploie |
| Webhook vocal → erreur 503 | `SUPABASE_SERVICE_ROLE_KEY` manquante | Ajoute-la sur Vercel |
| Webhook vocal → erreur 401 | Le `x-balia-secret` ne correspond pas | Même valeur des deux côtés |
| Appel journalisé mais « entreprise introuvable » | Numéro Balia non relié à une entreprise | Renseigne `numero_balia` ou passe `entreprise_id` en metadata Vapi |
| Pas de SMS | Clés Twilio absentes / numéro non vérifié | Vérifie les 3 variables Twilio |
| Bouton tarifs → inscription au lieu du paiement | `STRIPE_SECRET_KEY` absente | Ajoute-la (étape 3) |

---

*Guide lié au dépôt Balia. Récapitulatif des variables d'environnement dans
`.env.example`. Specs produit dans `balia/BIBLE.md`, plan du sprint dans
`balia/RUNBOOK.md`.*
