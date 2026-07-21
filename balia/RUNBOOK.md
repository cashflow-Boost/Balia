# ⚡ BALIA — RUNBOOK SPRINT 3 JOURS (MVP avec Claude Fable 5)

**Objectif du sprint :** un agent vocal qui décroche un vrai appel → qualifie → pose un créneau → envoie un SMS de confirmation → dashboard « CA récupéré ». Déployé sur ton nom de domaine, avec un logo.

**Hors scope 3 jours (v2) :** devis + TVA + signature, relances automatiques, WhatsApp, facturation, multi-techniciens.

---

## PARTIE 1 — LES COMPTES À CRÉER (et ce qui se connecte à quoi)

> Fais TOUT ça la veille du sprint (« Jour 0 »). ~2h. Note chaque clé/API dans un gestionnaire de mots de passe.

| # | Compte | Rôle | Se connecte à |
|---|---|---|---|
| 1 | **GitHub** (github.com) | Héberge le code | Claude Code y pousse ; Vercel y déploie |
| 2 | **Anthropic Console** (console.anthropic.com) | Clé API + modèle `claude-fable-5` = le cerveau de l'agent | L'app + la plateforme vocale |
| 3 | **Claude Code** (`npm i -g @anthropic-ai/claude-code`) | Ton constructeur IA (écrit le code) | Ton terminal + ton compte Anthropic |
| 4 | **Supabase** (supabase.com) — **région UE** | Base de données + auth | L'app (Vercel) via clés/connection string |
| 5 | **Vercel** (vercel.com) | Hébergement + déploiement | GitHub (auto-deploy) + le domaine |
| 6 | **Twilio** (twilio.com) | Numéro de téléphone + voix + SMS | Webhook voix → endpoint de l'app + plateforme vocale |
| 7 | **Vapi** (vapi.ai) **ou Retell** (retellai.com) | Pipeline vocal clé-en-main (STT+TTS+LLM sur Twilio) | Twilio + clé Anthropic Fable 5 |
| 8 | **Stripe** (stripe.com) | Abonnements (Jour 3, optionnel) | L'app via clés API + webhook |
| 9 | **Registrar domaine** (OVH pour .fr, ou Cloudflare/Namecheap) | Achat du nom de domaine | DNS pointé vers Vercel |
| 10 | **Outil logo** (Looka / Canva / Claude Design) | Logo + identité | Rien (export PNG/SVG) |

**Le point critique = le vocal.** Pour tenir 3 jours, tu NE câbles PAS toi-même Twilio Media Streams + STT + TTS + LLM. Tu utilises **Vapi ou Retell** : ils font le pipeline vocal en production, tu branches ton numéro Twilio et ta clé Fable 5, et tu écris juste la logique métier (qualification + créneau). C'est ce qui rend le sprint possible.

---

## PARTIE 2 — ACHETER LE NOM DE DOMAINE

1. Choisis le nom : `balia.fr` (crédibilité France) + `balia.com`/`getbalia.com` en secours. Vérifie la dispo directement chez le registrar.
2. **Où l'acheter :** OVHcloud (idéal pour un `.fr`, français, ~8-12 €/an), ou Cloudflare Registrar (prix coûtant, DNS excellent), ou Namecheap.
3. Achète-le. Active la protection de la vie privée (WHOIS privacy) si proposée.
4. **Connexion à Vercel :** dans Vercel → projet → Settings → Domains → ajoute `balia.fr`. Vercel te donne les enregistrements DNS (A / CNAME). Copie-les chez ton registrar. Propagation : quelques minutes à 24h.
5. Le HTTPS est automatique via Vercel.

---

## PARTIE 3 — TROUVER UN LOGO (30-60 min, pas plus)

Option rapide et pro :

1. **Looka** (looka.com) : tape « Balia », choisis un style épuré, génère → tu obtiens un logo + kit de marque (PNG/SVG, couleurs, favicon). ~20 €.
2. **Alternative gratuite :** Canva (template logo, wordmark simple) ou un générateur d'image IA pour l'idée, puis nettoyage dans Canva.
3. **Direction artistique** (cf. Tome 21 de la Bible) : simple, chaleureux, pas « tech froide ». Un wordmark « Balia » lisible + une couleur d'accent. Évite le sur-design.
4. Exporte : logo SVG + PNG, favicon, et note les codes couleur (tu les donnes à Claude Code pour le style de l'app).

---

## PARTIE 4 — LE PLANNING HEURE PAR HEURE

### 🗓️ JOUR 0 (veille) — Préparer le terrain (~2h)

- [ ] Créer les 10 comptes (Partie 1). Récupérer toutes les clés API.
- [ ] Installer Node.js puis Claude Code : `npm i -g @anthropic-ai/claude-code`.
- [ ] Acheter le domaine (Partie 2).
- [ ] Faire le logo (Partie 3).
- [ ] Acheter un numéro Twilio (France ou mobile).

### 🗓️ JOUR 1 — Le squelette + l'agent qui décroche

- [ ] **Matin** — Avec Claude Code, scaffolder l'app : Next.js déployable sur Vercel, connectée à Supabase. Créer le schéma de base (tables `entreprises`, `appels`, `clients_finaux`, `rendez_vous` — cf. Tome 13 de la Bible). Auth artisan basique.
- [ ] **Midi** — Pousser sur GitHub, connecter Vercel → premier déploiement en ligne (même vide).
- [ ] **Après-midi** — Configurer Vapi/Retell : créer l'assistant vocal, brancher le numéro Twilio, coller le **prompt système de l'agent** (cf. Tome 28 de la Bible), connecter le modèle `claude-fable-5`.
- [ ] **Fin de journée** — Tu appelles ton numéro Twilio → l'agent décroche et tient une conversation. ✅ Jalon 1.

### 🗓️ JOUR 2 — Qualifier + poser le créneau + SMS

- [ ] **Matin** — Logique de qualification : l'agent extrait nature/urgence/code postal/coordonnées (prompt d'extraction JSON, Tome 28) et écrit dans Supabase (`appels`).
- [ ] **Midi** — Prise de créneau : agenda simple dans Supabase, l'agent propose 2 créneaux et crée un `rendez_vous`.
- [ ] **Après-midi** — SMS de confirmation via Twilio après la prise de RDV.
- [ ] **Fin de journée** — Dashboard : liste des appels captés, RDV posés, et le compteur **« CA récupéré »** (somme des `ca_estime`). ✅ Jalon 2.

### 🗓️ JOUR 3 — Polir, marquer, déployer, encaisser

- [ ] **Matin** — Appliquer le logo + couleurs, écran d'onboarding minimal (nom entreprise, zone, horaires), page d'accueil.
- [ ] **Midi** — Brancher le domaine (Partie 2) sur Vercel. Vérifier le HTTPS.
- [ ] **Après-midi** — (Optionnel) Stripe Checkout pour l'abonnement Pro (349 €/mois) + page de tarifs.
- [ ] **Fin de journée** — Test bout-en-bout : tu appelles → RDV posé → SMS reçu → visible sur le dashboard en ligne, sur ton domaine. ✅ MVP LIVE.

---

## PARTIE 5 — ORDRE DES CONNEXIONS (récapitulatif visuel)

```
Claude Code  ──écrit le code──►  GitHub  ──auto-deploy──►  Vercel ──sert──► balia.fr
                                                              │
                                              env vars: clés Anthropic, Supabase, Twilio, Stripe
                                                              │
        ┌─────────────────────────────────────────────────────┤
        ▼                         ▼                            ▼
    Supabase (UE)            Twilio (n° + SMS)            Stripe (abo)
     données/auth                 │
                                  ▼
                          Vapi / Retell ──utilise──► Claude Fable 5 (cerveau vocal)
```

---

## PARTIE 6 — CE QU'IL FAUT DIRE À CLAUDE CODE (pour aller vite)

- Donne-lui **la Bible** (au moins Tomes 5-16 + 28) comme contexte : specs produit, schéma SQL, prompts.
- Demande-lui de travailler **par jalons** (squelette → agent → qualification → RDV → dashboard), pas tout d'un coup.
- Fais-lui **committer souvent** sur GitHub (chaque jalon = un déploiement Vercel testable).
- Précise la stack : **Next.js + Supabase + Vercel + Twilio + Vapi/Retell + Claude Fable 5**.

---

## ⚠️ PIÈGES À ÉVITER

1. **Ne construis pas le pipeline vocal from scratch.** Vapi/Retell = jours gagnés.
2. **WhatsApp = pas en 3 jours** (validation Meta longue). SMS d'abord.
3. **Devis/TVA/signature = v2.** Ne les mets pas dans le sprint.
4. **Numéro Twilio :** vérifie la disponibilité d'un numéro FR et les éventuelles pièces justificatives (peut prendre un peu de temps — anticipe au Jour 0).
5. **Données en région UE** dès la création Supabase (impossible à changer après facilement).
6. **Teste sur ton propre téléphone** avant de montrer à un artisan.

---

*Runbook lié à la BALIA BIBLE Dépannage v1. Le MVP de ce sprint = le pilier « décrocher + qualifier + RDV + preuve ». Les design partners (Tome 19) se recrutent en parallèle pour tester ce MVP dès qu'il est live.*
