# BALIA — Le système d'exploitation IA de l'immobilier

### Brief Maître v2 — généralisé à tous les professionnels de l'immobilier

*Zone : France, Belgique, Suisse, Luxembourg. Cette version remplace la v1 : avatars retirés, pricing refait, éléments non viables corrigés et séquencés.*

---

## 0. Comment lire ce document — la règle qui change tout

Ce document sépare volontairement deux choses que la version précédente mélangeait :

- **La VISION** — l'histoire à 10 ans, ambition pleine, qui sert à vendre, à lever, à recruter. Ici, plus c'est grand, mieux c'est.
- **Le BUILD** — ce que tu shippes réellement, dans un ordre réaliste. Ici, plus c'est focalisé et livrable, mieux c'est.

Le mélange des deux est ce qui coule les projets ambitieux : on met les features de rêve dans le MVP, et on ne sort jamais. La vision reste maximale ; la roadmap la séquence. **On ne coupe pas l'ambition, on la met dans le bon ordre.**

---

## 1. Positionnement & vision

**Balia est le premier système d'exploitation IA de l'immobilier.** Pas un CRM, pas un logiciel de plus : un cerveau qui se connecte à la structure, connaît tout de son activité, et **fait le travail** — l'humain valide et décide.

- **Promesse (Vision) :** « Vous ne travaillez plus *sur* un logiciel. Vous travaillez *dans* Balia. »
- **Promesse (opérationnelle, celle qui vend aujourd'hui) :** « Balia fait le travail répétitif à votre place et fait performer chaque collaborateur comme votre meilleur élément. »

Le triangle défendable, à ne jamais perdre : **Consolidation** (remplace la pile d'outils) **+ Agentique** (ça fait le taf, ça n'attend pas qu'on clique) **+ Alignement** (on est payé au résultat).

---

## 2. Pour qui — le spectre complet (sans avatars)

Balia sert **tous les professionnels de l'immobilier**, du solo au réseau. C'est cohérent avec le positionnement « OS de l'immobilier » : un même cerveau, des modules qui s'activent selon le métier.

- Mandataires et conseillers indépendants
- Agences de transaction (indépendantes et franchisées)
- Réseaux et têtes de réseau (multi-sites)
- Administrateurs de biens / gestion locative
- Syndics de copropriété
- Promoteurs et VEFA
- Chasseurs immobiliers
- Marchands de biens et investisseurs

**Principe produit :** le socle (le cerveau + les agents cœur) est commun à tous ; les métiers spécifiques (syndic, gestion locative, promotion…) sont des **modules activables**, pas des produits séparés. Une structure n'allume que ce dont elle a besoin.

---

## 3. Les problèmes à régler (valables pour tout pro de l'immobilier)

Du plus douloureux (donc du plus vendeur) au moins critique :

1. **Fuite de leads.** Un contact entrant non rappelé vite est perdu. → Balia rappelle/écrit en minutes, 24/7, qualifie, prend le RDV.
2. **Temps gaspillé sur des pistes non qualifiées** (visites inutiles, prospects non financés). → Balia pré-qualifie budget/financement/motivation.
3. **Acquisition de mandats / de biens.** Décrocher exige réactivité et argumentaire crédible. → Balia produit l'avis de valeur, l'argumentaire, prépare le rendez-vous.
4. **Surcharge administrative.** Annonces, saisie, diffusion, relances, dossiers, suivi, conformité. → Balia exécute, l'humain valide.
5. **Clients/vendeurs mal informés** qui perdent confiance. → Balia génère et envoie le reporting automatiquement.
6. **Désordre du portefeuille** (mandats qui expirent, rapprochements oubliés). → Balia surveille, rapproche, alerte, relance.
7. **Détection d'opportunités** (biens sous ou sur-cotés, fourchette de négociation). → Balia estime, compare au marché, propose une offre argumentée.
8. **Hétérogénéité des équipes.** Les débutants sous-performent. → l'IA fait le plus progresser les moins expérimentés (effet mesuré et réel), donc chaque collaborateur monte au niveau des meilleurs.
9. **Coût et éparpillement** de 3 à 5 abonnements. → un seul cerveau, données unifiées, moins cher que la pile totale.

---

## 4. La solution — le cerveau + les agents

Architecture : **une IA monolithique en façade** (le cerveau Balia, interface vocale + chat, personnalisée par structure) qui orchestre **invisiblement des agents spécialisés**. L'utilisateur parle à un seul interlocuteur, jamais à douze outils.

**Agents cœur (socle, tous métiers) :**
Estimation & analyse de marché · Pige & acquisition · Leads + qualification + prise de RDV · CRM & rapprochement automatique · Génération d'annonces · Home staging virtuel / 3D · Multidiffusion portails · Communication multi-canal (email/SMS/WhatsApp/voix) · Dossiers, compromis & signature · Reporting client/vendeur & pilotage.

**Modules métier (activables) :**
Gestion locative · Syndic · Promotion / VEFA · Luxe · Commercial · Viager · Saisonnier · Investissement.

**Le geste, partout — le principe d'ergonomie non négociable :**

> Tu parles (voix/texte) → Balia fait (agents invisibles) → une **carte de résultat** apparaît → tu valides d'un geste.

Jamais de formulaire ni de menu quand Balia peut faire la chose et te présenter le résultat.

---

## 5. Ce que j'ai retiré ou corrigé — et par quoi je l'ai remplacé

Journal d'amélioration honnête. Rien de l'ambition n'est supprimé ; ce qui posait problème est **corrigé ou repoussé au bon horizon**.

| Élément d'origine | Problème | Ce qu'on en fait |
|---|---|---|
| « Supérieur à Salesforce, HubSpot, Dynamics, Apimo, Hektor, Netty… » | Guerre frontale ingagnable pour une petite équipe | On se différencie par l'agentique + l'alignement, pas par « on fait tout mieux ». On ne se compare frontalement à personne. |
| Lunettes AR pendant les visites | Non livrable à court terme, coûteux, gadget au lancement | **Horizon 3.** Remplacé au MVP par : compte-rendu de visite auto (Balia résume les notes que l'agent dicte). |
| « L'IA observe clics, emails, appels » + « probabilité d'achat » du client affichée | **Champ de mines RGPD**, repoussoir commercial (sent la surveillance) | **Retiré.** Remplacé par : Balia agit sur les données que la structure lui confie explicitement, avec consentement et journal d'audit. La confidentialité devient un argument de vente. |
| « L'OS remplace Outlook/Excel/Word » | Irréaliste et inutile au lancement | **Vision.** Au build : Balia **se connecte** à ces outils (connecteurs), il ne les remplace pas. |
| Mode autonome de nuit (répond, agit seul) | Responsabilité : un message halluciné à un client = client perdu | **Séquencé.** Autonomie *supervisée* et progressive ; humain dans la boucle sur tout acte qui sort de la structure. La nuit, Balia **prépare**, il n'**envoie** pas sans validation. |
| Digital twin qui simule « le CA futur / la baisse des taux » | Promesse de boule de cristal que personne ne tient | **Horizon 2+.** Au build : simulation *au niveau du bien/de l'offre* (comparables, fourchette de négo) — ça, c'est solide et livrable. La simulation macro reste modeste. |
| 100+ agents, tous les métiers dès le départ | Zéro focus = jamais livré | **Séquencé** en modules activables. Socle d'abord, métiers ensuite. |
| Chiffre « +55 % » en argument de vente | Chiffre mal attribué (tâche de code en labo), débunkable | **Remplacé** par des chiffres vrais et sourcés (voir §3, point 8 : l'IA fait surtout progresser les débutants — c'est l'argument fort et défendable). |

---

## 6. Architecture & stack

- **Modèle :** IA monolithique en façade orchestrant des agents spécialisés invisibles.
- **LLM :** Claude API (Sonnet pour le volume, Opus pour le raisonnement complexe).
- **Data/back :** Supabase. **Déploiement :** Vercel. **Comms :** Twilio. **Signature :** DocuSign. **Paiement :** Stripe.
- **Connecteurs (architecture ouverte) :** Google Workspace / Microsoft 365, portails (SeLoger, LeBonCoin, BienIci…), CRM existants, outils comptables et cadastraux, API publiques. Balia **se branche** à l'existant, il ne force pas le remplacement.
- **Surfaces :** mobile (voix, terrain) + desktop (pilotage) + compagnon navigateur (transition). Un seul cerveau, vue et permissions selon le rôle.

---

## 7. PRICING — entièrement refait (généralisé, sans avatars)

Ton intuition « prix fixe + petite part au résultat » est conservée, mais structurée pour (a) couvrir tout le spectre, du solo au réseau, (b) protéger ta marge, (c) rester juridiquement propre.

**Le modèle a 4 briques :**

1. **Socle plateforme (fixe, récurrent).** Le cerveau + les agents cœur. Par structure.
2. **Par siège actif (fixe, récurrent).** Chaque collaborateur qui a son environnement Balia.
3. **Frais de succès (variable, aligné — optionnel et désactivable).** Un **forfait fixe** déclenché quand Balia a porté un dossier jusqu'à la transaction. C'est la « petite commission » — mais un **montant forfaitaire**, PAS un % du prix de vente (voir garde-fou Hoguet §11). L'agence peut choisir « tout fixe » ou « fixe réduit + succès ».
4. **Usage inclus puis à la conso (transparent).** Un forfait de comms/traitements IA inclus par siège ; au-delà, SMS/WhatsApp/minutes de voix/traitements lourds facturés à la conso. Ça protège ta marge (voix + Opus coûtent).

**Grille indicative à valider (hypothèses de départ, pas des prix figés) :**

| | Indépendant | Agence / cabinet | Réseau / Enterprise |
|---|---|---|---|
| Socle plateforme | inclus | ~149 €/mois | sur devis |
| Par siège actif | 1 siège inclus | ~69 €/mois/siège (dégressif) | per-seat dégressif |
| Comms/IA incluses | forfait de base | forfait par siège | pool mutualisé |
| Frais de succès (option) | forfait fixe / transaction portée | idem, désactivable | négocié |
| Total repère | ~99–149 €/mois | socle + sièges | contrat cadre |
| Marketplace (Horizon 3) | — | rev-share sur skills tiers | rev-share |

**Pourquoi ça tient :** une pile d'outils immo coûte 1 500–4 000 €/an et reste passive. Balia se positionne **au niveau d'un CRM métier par siège**, remplace 3 à 5 outils, **et fait le travail** — donc moins cher que la pile totale, pour beaucoup plus de valeur. Le fixe rassure ; le succès aligne ; l'usage protège ta marge.

**À tester tôt :** le ratio fixe/succès (les indépendants préfèrent souvent « tout fixe » prévisible ; les structures qui closent beaucoup acceptent le succès contre un fixe réduit).

---

## 8. Le fossé (défensibilité durable)

1. **Donnée propriétaire accumulée** — prix et comportements locaux, multi-structures : impossible à recréer pour un nouvel entrant.
2. **Profondeur réglementaire** — Hoguet, mandats, diagnostics, RGPD, spécificités syndic/gestion : maîtrise maintenue en continu.
3. **Coûts de bascule** — une fois branché aux portails, CRM, comms et dossiers, te déloger coûte cher au client.
4. **Alignement au résultat** — une confiance que les éditeurs à licence ne peuvent pas répliquer sans se cannibaliser.

---

## 9. Différenciation

- **vs suites tout-en-un (Netty/Modelo, Septeo, Hektor, Apimo)** : elles centralisent des outils passifs ; Balia exécute et s'aligne. Ne jamais se vendre comme « un CRM de plus ». *(Septeo, consolidateur, est la menace à surveiller — d'où l'importance de courir vite sur l'agentique.)*
- **vs outils IA ponctuels (PriceHubble, IACrea, Prospeneo…)** : eux couvrent une brique ; Balia orchestre la chaîne complète.
- **vs géants (Copilot, Agentforce)** : ils ignorent la TPE/PME immobilière francophone ; profondeur métier + langue + alignement = terrain qu'ils ne prennent pas.

---

## 10. Roadmap phasée (release order, pas rétrécissement du marché)

Le produit vise tout le monde ; les capacités s'allument dans un ordre qui permet de livrer.

- **MVP** — socle : Leads + qualification + prise de RDV, génération d'annonces, multidiffusion, comms multi-canal, carte-de-résultat + validation. Objectif : valeur dès la 1re semaine, accès minimal, RGPD-clean, humain dans la boucle.
- **V1** — estimation/analyse de marché + détection d'opportunités, CRM & rapprochement, reporting client/vendeur, dashboard structure.
- **V2** — modules métier activables (gestion locative, syndic, promotion…), autonomie supervisée étendue, simulation au niveau bien/offre.
- **Horizon 3 (Vision)** — marketplace de skills/agents tiers, AR de visite, jumeau numérique avancé, couche d'intelligence reliant les acteurs (notaires, banques, assureurs…).

---

## 11. Garde-fous non négociables (ce qui te protège)

- **RGPD / confidentialité :** Balia agit uniquement sur les données confiées explicitement, avec consentement et journal d'audit. Pas de surveillance des salariés, pas de scoring intrusif affiché sur un client. Hébergement UE. **La confidentialité est un argument de vente, pas une contrainte à contourner.**
- **Loi Hoguet :** un prélèvement en % sur une transaction immobilière peut exiger carte pro / statut d'apporteur d'affaires. → Le « frais de succès » est un **forfait logiciel lié à un livrable Balia**, pas une part du prix de vente. À faire valider par un avocat spécialisé avant de figer.
- **Humain dans la boucle :** tout acte qui sort de la structure (mail client, annonce publiée, dossier signé) passe par une validation. La voix commande ; l'œil valide ce qui sort.

---

## 12. SUPER-PROMPT CONDENSÉ (à copier / réutiliser)

> **Contexte.** Balia est le système d'exploitation IA de l'immobilier (FR/BE/CH/LU), pour **tous** les professionnels du secteur (mandataires, agences, réseaux, gestion locative, syndics, promoteurs, chasseurs, investisseurs). Pas un CRM ni une suite tout-en-un de plus : un cerveau qui **fait le travail** et **remplace la pile fragmentée** (pige, estimation, CRM, qualification, annonces, staging 3D, multidiffusion, comms, dossiers, signature). Positionnement : Consolidation + Agentique + Alignement au résultat.
>
> **Architecture.** IA monolithique en façade (cerveau vocal + chat, personnalisé par structure) orchestrant des agents invisibles. Socle commun + modules métier activables. Stack : Claude API (Sonnet/Opus), Supabase, Vercel, Twilio, DocuSign, Stripe ; connecteurs Google/Microsoft, portails, CRM, comptable, cadastre, API. Un seul cerveau, jamais douze outils.
>
> **Ergonomie.** Geste unique partout : tu parles → Balia fait → carte de résultat → tu valides d'un geste. Voix pour commander ; validation visuelle pour tout ce qui sort de la structure.
>
> **Problèmes résolus :** fuite de leads · pistes non qualifiées · acquisition de mandats/biens · surcharge admin · clients mal informés · portefeuille en désordre · détection d'opportunités (sous/sur-coté) · montée en compétence des débutants · coût et éparpillement des outils.
>
> **Pricing.** 4 briques : socle plateforme (fixe) + par siège actif (fixe) + frais de succès forfaitaire optionnel et désactivable (PAS un % du prix — garde-fou Hoguet) + usage comms/IA inclus puis à la conso. Repères : indépendant ~99–149 €/mois ; agence socle ~149 € + ~69 €/siège dégressif ; réseau sur devis ; marketplace rev-share en Horizon 3. Positionné au niveau d'un CRM par siège tout en remplaçant 3–5 outils.
>
> **Fossé.** Donnée propriétaire multi-structures + profondeur réglementaire (Hoguet/RGPD) + coûts de bascule + alignement au résultat.
>
> **Différenciation.** vs Netty/Septeo/Hektor/Apimo (outils passifs) : Balia exécute et s'aligne. vs outils IA ponctuels : orchestration complète. vs Copilot/Agentforce : ils ignorent la TPE immo francophone. Menace : Septeo (consolidateur).
>
> **Roadmap.** MVP (leads/qualif/RDV, annonces, diffusion, comms) → V1 (estimation, opportunités, CRM, reporting) → V2 (modules métier, autonomie supervisée) → H3 (marketplace, AR, jumeau numérique, couche inter-acteurs). RGPD + humain-dans-la-boucle intégrés dès le départ.
>
> **Garde-fous.** RGPD (données confiées, consentement, audit, hébergement UE, zéro surveillance) · Hoguet (succès forfaitaire, pas % du prix, à valider juridiquement) · humain dans la boucle sur tout acte sortant.

---

*Fin du brief v2. Prochaine étape naturelle : dérouler le parcours de bout en bout d'un agent du MVP (ex. lead entrant → qualification → RDV → validation), en specs prêtes pour Etan → voir [`docs/specs/agent-leads-mvp.md`](specs/agent-leads-mvp.md).*
