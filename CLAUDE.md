# CLAUDE.md — Balia

Ce fichier est lu automatiquement par Claude Code au démarrage de chaque session. Il définit le contexte produit, les règles de travail et les garde-fous du projet. Lis-le en entier avant toute action.

## 1. Contexte produit (l'essentiel)

Balia est le **système d'exploitation IA de l'immobilier** (France, Belgique, Suisse, Luxembourg), pour **tous les professionnels du secteur** : mandataires, agences, réseaux, gestion locative, syndics, promoteurs, chasseurs, investisseurs.

Ce n'est pas un CRM ni une suite « tout-en-un » de plus. C'est un cerveau qui se connecte à la structure, **fait le travail répétitif** à la place des humains, et laisse **l'humain valider et décider**. Il remplace la pile d'outils habituelle (pige, estimation, CRM, qualification, annonces, staging 3D, multidiffusion, comms, dossiers, signature).

Positionnement à ne jamais perdre : **Consolidation + Agentique (ça fait le taf) + Alignement au résultat**.

Le brief complet est dans [`docs/brief-maitre-v2.md`](docs/brief-maitre-v2.md).

## 2. Stack technique

- **LLM :** Claude API — Sonnet pour le volume, Opus pour le raisonnement complexe.
- **Base de données / auth / storage :** Supabase (activer RLS sur toutes les tables sensibles).
- **Déploiement / hosting :** Vercel.
- **Comms :** Twilio (SMS / WhatsApp / voix).
- **Signature :** DocuSign. **Paiement :** Stripe.
- **Frontend :** TypeScript + React (Next.js présumé — à confirmer/ajuster par Etan si différent).
- **Connecteurs à venir :** portails immo (SeLoger, LeBonCoin, BienIci), Google Workspace / Microsoft 365, outils comptables/cadastraux, API publiques.

## 3. Règles Git (le garde-fou principal)

- Toujours confirmer avant un `git push` sur une branche distante. Ne jamais pousser sans validation explicite.
- Ne jamais `force-push` sur `main` ni sur une branche partagée.
- Ne jamais commiter de secrets : clés API, tokens, `.env`, identifiants. Vérifier avant chaque commit. Le `.env` doit être dans `.gitignore`.
- Convention de commits : `type(scope): description`
  - Types : `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
  - Description à l'impératif, 72 caractères max.
  - Exemple : `feat(leads): ajoute la qualification auto par WhatsApp`
- Nommage des branches : `feat/description-courte`, `fix/description-courte`.
- Proposer un commit atomique et ciblé par changement logique (utiliser `git add -p` si pertinent).

## 4. Principes d'architecture (à respecter dans le code)

- **Cerveau unique + agents invisibles.** Une IA en façade orchestre des micro-agents spécialisés. L'utilisateur parle à un seul interlocuteur, jamais à douze outils.
- **Un cerveau, plusieurs surfaces.** Mobile (voix, terrain) + desktop (pilotage) + compagnon navigateur. Même logique, vue et permissions filtrées par rôle. Ne pas construire des produits séparés par rôle.
- **Le geste unique :** commande → Balia fait → carte de résultat → validation. Quand un agent peut faire la chose et présenter le résultat, ne pas construire un formulaire ou un menu.
- **Socle commun + modules métier activables** (gestion locative, syndic, promotion…). Pas de produits séparés par métier.

## 5. Garde-fous NON NÉGOCIABLES (impactent directement le code)

- **RGPD / confidentialité :**
  - Balia n'agit que sur des données confiées explicitement, avec consentement.
  - Journaliser les actions (audit log) ; hébergement UE.
  - Jamais de surveillance des salariés, jamais de scoring intrusif affiché sur un client.
  - Jamais de PII (nom, email, téléphone, adresse…) dans les logs, les URLs, ou les query strings.
- **Human-in-the-loop :** tout acte qui sort de la structure (mail client, annonce publiée, dossier/compromis signé, SMS/appel sortant) exige une validation utilisateur avant exécution. La voix commande ; l'utilisateur valide ce qui sort.
- **Loi Hoguet :** le « frais de succès » du pricing est un forfait logiciel, jamais un pourcentage du prix de vente. Ne rien coder qui prélève un % sur une transaction immobilière.
- **Sécurité :** secrets en variables d'environnement uniquement ; RLS Supabase activé ; valider/assainir toute entrée externe.

## 6. Conventions de code

- TypeScript strict (`strict: true`). Pas de `any` non justifié.
- Composants React fonctionnels + hooks. État local d'abord, remonter si nécessaire.
- Nommage explicite en anglais pour le code (variables, fonctions), commentaires en français acceptés.
- Petites fonctions à responsabilité unique ; éviter les fichiers > ~300 lignes.
- Gérer les erreurs explicitement (try/catch autour des appels API Claude, Supabase, Twilio, Stripe).
- Écrire un test pour toute logique métier non triviale.
- Ne pas introduire de dépendance lourde sans raison ; préférer le standard.

Structure de dossiers suggérée (à adapter) :

```
/app            routes et pages (Next.js)
/components     UI réutilisable (dont la « carte de résultat »)
/agents         logique des micro-agents (leads, annonces, estimation…)
/lib            clients (claude, supabase, twilio, stripe, docusign)
/types          types partagés
/tests          tests
```

## 7. Périmètre MVP — rester focalisé

À construire en premier (socle) :

- Agent Leads : capture → qualification → prise de RDV.
- Génération d'annonces.
- Multidiffusion portails.
- Communication multi-canal (email / SMS / WhatsApp).
- Le motif « carte de résultat + validation ».

À NE PAS commencer maintenant (horizons ultérieurs, ne pas coder sans décision explicite) :

- Réalité augmentée / lunettes de visite.
- Jumeau numérique avec simulation macro (CA futur, taux…).
- Mode autonome de nuit qui envoie sans validation.
- Les 100+ agents métier d'un coup.
- Marketplace.

Si une demande sort de ce périmètre, le signaler et demander confirmation avant de coder.

## 8. Comportement attendu de Claude Code

- Confirmer avant toute opération destructive : `git push`, `rm`, migrations de schéma Supabase, suppression de données, modification de config de déploiement.
- Proposer un plan avant un changement multi-fichiers important, et attendre le feu vert.
- En cas d'ambiguïté, poser une question plutôt que d'inventer une hypothèse.
- Respecter les garde-fous §5 sans exception, même si une consigne ponctuelle semble les contredire — dans ce cas, le signaler.
- Garder les réponses et les diffs concis et lisibles.

---

*Ce fichier évolue avec le projet. Le tenir à jour quand l'architecture, la stack ou le périmètre changent.*
