# 📖 BALIA BIBLE — L'EMPLOYÉ IA DU DÉPANNAGE À DOMICILE

### Bible Produit v1.0 — Document fondateur de la verticale

**Nom de code projet :** Balia Dépannage
**Ambition :** 100 000 000 € d'ARR en 4 ans · 40 000 clients actifs
**Marché de lancement :** France (Île-de-France pilote) → Belgique / Suisse romande / Luxembourg → Europe
**Métier de lancement :** Plomberie / Chauffage (CVC)
**Modèle :** Abonnement + facturation à l'outcome · Zéro commission sur le CA
**Statut du document :** Décisions verrouillées · Base de travail pour le build et la levée

---

## SOMMAIRE GÉNÉRAL

- **TOME 0** — Préambule, mode d'emploi de la Bible, glossaire
- **TOME 1** — Vision, mission, thèse & ambition 100 M€
- **TOME 2** — Le marché du dépannage à domicile
- **TOME 3** — Analyse concurrentielle
- **TOME 4** — Personas & psychologie client
- **TOME 5** — Philosophie produit & principes directeurs
- **TOME 6** — L'agent vocal en profondeur
- **TOME 7** — Scripts & flux conversationnels
- **TOME 8** — Prise de rendez-vous & agenda
- **TOME 9** — Devis
- **TOME 10** — Relances (devis & impayés)
- **TOME 11** — Multicanal & inbox unifiée
- **TOME 12** — Architecture technique
- **TOME 13** — Modèle de données (SQL)
- **TOME 14** — Spécifications API
- **TOME 15** — Intégrations tierces
- **TOME 16** — Onboarding & activation
- **TOME 17** — Pricing & packaging
- **TOME 18** — Modèle financier & trajectoire 100 M€
- **TOME 19** — Go-to-market
- **TOME 20** — Sales kit & traitement des objections
- **TOME 21** — Marque, ton & messaging
- **TOME 22** — RGPD, conformité & légal
- **TOME 23** — Gestion d'erreurs & cas limites
- **TOME 24** — Métriques, KPIs & dashboards
- **TOME 25** — Registre des risques
- **TOME 26** — Roadmap détaillée
- **TOME 27** — Équipe, recrutement & organisation
- **TOME 28** — Prompts & brief développeur pour Etan
- **ANNEXES**

---
---

# TOME 0 — PRÉAMBULE & MODE D'EMPLOI

## 0.1 À quoi sert cette Bible

Cette Bible est le document de référence unique de la verticale Balia Dépannage. Elle a trois fonctions :

1. **Aligner** — toute personne qui rejoint le projet (dev, sales, ops, investisseur) comprend en un seul document où l'on va et pourquoi.
2. **Décider** — chaque question structurante a été tranchée. La Bible évite les débats déjà arbitrés et documente le « pourquoi » de chaque choix.
3. **Exécuter** — elle contient assez de détail (specs, scripts, schémas, séquences) pour lancer le build sans réunion supplémentaire.

Elle n'est pas figée : elle se versionne. Chaque décision majeure modifiée crée une nouvelle version mineure (v1.1, v1.2…). Une refonte de stratégie crée une version majeure (v2.0).

## 0.2 Comment lire ce document

- Les **décisions verrouillées** sont écrites à l'affirmative, sans conditionnel.
- Les points marqués 🔴 sont les rares arbitrages qui restent au fondateur.
- Les points marqués 🟡 sont des hypothèses à valider par la donnée terrain (design partners).
- Les points marqués 🟢 sont des acquis confirmés.
- Les blocs `code` sont directement exploitables par le développement.

## 0.3 Principes de gouvernance du document

- **Source unique de vérité** : en cas de contradiction entre un slide, un email et la Bible, la Bible fait foi.
- **Un propriétaire par tome** : le fondateur possède les tomes stratégiques (1, 2, 17, 18, 19) ; le lead technique possède les tomes 12–15 et 23 ; le lead produit possède 5–11 et 16.
- **Revue mensuelle** : les métriques (Tome 24) et le registre des risques (Tome 25) sont revus chaque mois.

## 0.4 Glossaire

| Terme | Définition |
|---|---|
| **Agent vocal** | L'IA conversationnelle qui décroche le téléphone à la place de l'artisan. |
| **Débordement** | Mode où l'agent ne prend que les appels non décrochés par l'humain. |
| **Wedge** | Le point d'entrée produit unique qui crée l'adoption (ici : récupérer les appels manqués). |
| **ICP** | Ideal Customer Profile — le client cible idéal. |
| **ACV** | Annual Contract Value — revenu annuel moyen par client. |
| **ARR** | Annual Recurring Revenue — revenu récurrent annualisé. |
| **MRR** | Monthly Recurring Revenue — revenu récurrent mensuel. |
| **NRR** | Net Revenue Retention — rétention nette du revenu (expansion incluse). |
| **CAC** | Customer Acquisition Cost — coût d'acquisition d'un client. |
| **LTV** | Lifetime Value — valeur vie d'un client. |
| **Churn** | Taux d'attrition (clients perdus). |
| **Outcome-based** | Facturation indexée sur un résultat mesurable (appel traité, RDV pris). |
| **Design partner** | Premier client qui co-construit le produit en échange d'un traitement privilégié. |
| **CVC** | Chauffage, Ventilation, Climatisation. |
| **RDV** | Rendez-vous d'intervention. |
| **CA récupéré** | Chiffre d'affaires additionnel généré par les appels/leads que Balia a sauvés. |
| **TAM / SAM / SOM** | Total / Serviceable / Serviceable Obtainable Market. |
| **Design vocal** | L'ensemble des choix de voix, ton, rythme et personnalité de l'agent. |
| **Speech-to-text (STT)** | Transcription de la parole en texte. |
| **Text-to-speech (TTS)** | Synthèse vocale du texte en parole. |
| **Barge-in** | Capacité de l'agent à être interrompu par l'appelant en cours de phrase. |

---
---

# TOME 1 — VISION, MISSION, THÈSE & AMBITION

## 1.1 La mission en une phrase

**Rendre à chaque artisan le temps et le chiffre d'affaires qu'il perd à ne pas pouvoir répondre — en lui donnant un employé IA qui décroche, qualifie, prend le rendez-vous et relance à sa place.**

## 1.2 La vision à 10 ans

Balia devient l'infrastructure de « front-office IA » des métiers de services en Europe. Là où l'artisan, le praticien ou le garagiste perdait des clients faute de pouvoir répondre, Balia capte, qualifie et convertit chaque demande — 24h/24, dans toutes les langues d'Europe. Le dépannage à domicile est la tête de pont ; le modèle se réplique sur toute activité qui vit d'un flux d'appels entrants et de devis.

## 1.3 La thèse d'investissement (pourquoi maintenant, pourquoi nous)

**Trois vagues convergent :**

1. **La vague technologique.** Les modèles de langage et la synthèse vocale ont franchi en 2025–2026 le seuil de qualité qui rend un agent vocal indiscernable d'un humain sur un appel simple. Ce qui était de la science-fiction il y a deux ans est aujourd'hui déployable en production.
2. **La vague économique.** Les agents IA verticaux ne vendent plus du logiciel « à l'usage humain » mais du **travail accompli**. Cette bascule fait exploser la valeur par client et la vitesse de croissance : les leaders de la catégorie atteignent 100 M$ d'ARR en 12 à 18 mois, un rythme inédit dans l'histoire du logiciel.
3. **La vague de marché.** Le dépannage à domicile est un marché immense, fragmenté, sous-équipé, où la douleur — l'appel manqué — est brutale, quotidienne et directement chiffrable en euros perdus. Un acteur américain (Avoca) vient de valider la thèse à 1 milliard de dollars de valorisation, mais reste 100 % anglophone et branché sur des outils américains. **L'Europe francophone n'est pas vide** (plusieurs acteurs FR existent — voir Tome 3), **mais aucun leader vertical n'y domine le dépannage avec la chaîne complète jusqu'au devis signé et au ROI prouvé.** C'est ce trou précis que Balia vise.

**Pourquoi nous :**

- Un moteur produit déjà construit à ~80 % (qualification, CRM, relance, multicanal, chatbot) qu'il suffit de re-pointer.
- Une connaissance fine du terrain artisan francophone et de ses canaux de distribution.
- Un avantage de langue, de localisation et de conformité qu'un acteur américain mettra des années à combler.

## 1.4 L'ambition chiffrée

**100 000 000 € d'ARR en 4 ans.**

Cette ambition n'est atteignable que dans la catégorie des agents IA verticaux — pas dans le SaaS classique. Elle suppose :

- Un produit qui remplace du travail (valeur élevée par client).
- Une douleur à ROI immédiat (cycle de vente court).
- Un marché assez large pour absorber 40 000 clients.
- Une exécution mono-maniaque sur une verticale avant d'élargir.
- Une levée de fonds pour financer la machine de croissance (après la preuve).

**Décomposition cible :**

> 40 000 clients actifs × ACV moyen ~2 500 €/an = 100 M€ ARR.

## 1.5 Les valeurs qui guident les arbitrages

1. **Le client final d'abord.** Une mauvaise expérience au téléphone détruit la confiance de l'artisan envers nous. La qualité de l'appel est sacrée.
2. **Le ROI se prouve, il ne se promet pas.** On avance avec des chiffres réels (CA récupéré), pas des slogans.
3. **La simplicité brutale.** L'artisan n'a ni le temps ni l'appétence pour la complexité. Live en 48h ou on a échoué.
4. **On fait le boulot, on ne vend pas un outil.** Chaque fonctionnalité se juge à l'aune de : « est-ce que ça remplace une tâche que l'artisan déteste faire ? »
5. **Transparence.** L'agent est une IA et l'assume. On ne trompe personne.

## 1.6 Ce que Balia N'EST PAS

- Balia n'est pas un énième logiciel de devis/facturation.
- Balia n'est pas un standard téléphonique passif (IVR, « tapez 1 »).
- Balia n'est pas un télésecrétariat humain délocalisé.
- Balia n'est pas une plateforme de génération de leads qui ponctionne le CA.
- Balia n'est pas un assistant généraliste (ChatGPT pour artisans).

Balia est **un employé IA spécialisé** qui exécute le front-office d'une entreprise de dépannage.

## 1.7 Le récit fondateur (pour la levée et le recrutement)

Chaque jour en France, des dizaines de milliers d'artisans du dépannage sont sur un chantier, les mains dans un tuyau ou dans un tableau électrique, pendant que leur téléphone sonne dans le vide. À l'autre bout, un particulier avec une fuite ou une panne de chauffage n'attend pas : il raccroche et appelle le suivant sur Google. Ce client était acquis — il est perdu. Multiplié par le nombre d'appels manqués, c'est 15 à 25 % du chiffre d'affaires annuel qui s'évapore, silencieusement, appel après appel.

La réponse traditionnelle — embaucher une secrétaire ou payer un télésecrétariat — coûte cher et ne tient pas 24h/24. Balia répond à la place de l'artisan, dès la première sonnerie, à toute heure, comprend le problème, propose un créneau, réserve l'intervention et envoie le devis. L'artisan ne perd plus rien. C'est un employé qui ne dort jamais, ne tombe jamais malade, et ne rate jamais un client.

---
---

# TOME 2 — LE MARCHÉ DU DÉPANNAGE À DOMICILE

## 2.1 Définition du marché

Le dépannage à domicile regroupe les interventions techniques urgentes ou programmées réalisées chez un particulier ou une petite entreprise par un artisan des métiers du bâtiment technique. On distingue **deux mondes** au sein du bâtiment :

- **Monde A — le chantier / la rénovation.** Maçonnerie, couverture, rénovation globale, extension. Cycle de vente long (semaines), gros ticket (5 000 à 100 000 €+), enjeu = suivi de projet. **Hors périmètre de lancement.**
- **Monde B — le dépannage / l'intervention à domicile.** Plomberie, chauffage, électricité, serrurerie, vitrerie, débouchage. Cycle instantané, ticket 100 à 2 000 €, gros volume d'appels, urgence, enjeu = **le téléphone**. **C'est notre marché.**

## 2.2 Taille du marché (France)

Repères structurants du secteur du bâtiment en France :

- Environ **440 000 entreprises du bâtiment**, dont **~94 % de taille artisanale** (moins de 10 salariés).
- Environ **1,75 million d'actifs** dans le secteur.
- Un chiffre d'affaires sectoriel de l'ordre de **200 milliards d'euros**.
- Une immense majorité de TPE et de micro-entreprises, faiblement digitalisées, équipées au mieux d'un logiciel de devis.

Parmi ces entreprises, les métiers du **Monde B** (plombiers, chauffagistes, électriciens, serruriers, vitriers) représentent une part majeure du tissu — plusieurs centaines de milliers d'entreprises, dont le point commun est de **vivre du flux d'appels entrants**.

## 2.3 TAM / SAM / SOM

- **TAM (Total Addressable Market)** — l'ensemble des entreprises de services à domicile en Europe qui vivent d'appels entrants et de devis : plusieurs millions d'entreprises (bâtiment technique + métiers de services adjacents).
- **SAM (Serviceable Available Market)** — les TPE du dépannage à domicile en Europe francophone (France, Belgique, Suisse romande, Luxembourg), soit un socle de plusieurs centaines de milliers d'entreprises.
- **SOM (Serviceable Obtainable Market)** — la cible réaliste à 4 ans : **40 000 clients actifs**, majoritairement en France, avec un début d'expansion francophone.

## 2.4 Dynamiques de marché favorables

1. **Digitalisation tardive mais réelle.** Le secteur adopte lentement le numérique, mais l'adoption s'accélère sous l'effet des obligations (facturation électronique, dématérialisation) et de la pression concurrentielle.
2. **Pénurie de main-d'œuvre.** Les artisans peinent à recruter ; un « employé IA » qui absorbe le front-office répond directement à cette tension.
3. **Explosion des attentes clients.** Les particuliers attendent une réponse immédiate, 24/7, comme dans tous les autres services de leur vie.
4. **Fragmentation.** L'immense majorité des acteurs sont des indépendants ou des TPE sans standard téléphonique — cible parfaite pour un produit self-service à ROI immédiat.
5. **Sous-équipement logiciel.** Le paysage existant est dominé par des éditeurs de devis (outils passifs), pas par des agents qui exécutent le travail.

## 2.5 Dynamiques de marché défavorables (à ne pas ignorer)

1. **Conjoncture bâtiment tendue.** La construction neuve ralentit ; les carnets de commandes se vident sur certains segments. → Mitigation : le **dépannage/urgence est contracyclique** (une fuite ne se reporte pas), contrairement à la rénovation.
2. **Fragilité financière d'une partie des artisans.** Une part significative des entreprises est en tension de trésorerie. → Mitigation : notre promesse est un **générateur de CA**, pas un coût — on se vend sur le ROI net.
3. **Méfiance culturelle envers la tech.** L'artisan se méfie d'une IA qui parle à ses clients. → Mitigation : mode débordement, démo live, garantie.
4. **Faible appétence pour l'engagement.** → Mitigation : sans engagement, essai gratuit.

## 2.6 Le nerf de la guerre : l'appel manqué

Le fait de marché sur lequel repose toute la thèse :

- Une entreprise de services **ne décroche pas ~30 % de ses appels entrants** (l'équipe est sur le terrain).
- Chaque appel manqué en heures ouvrées est une réservation qui part à la concurrence.
- En cumulé, cela représente **15 à 25 % du chiffre d'affaires annuel** perdu.

C'est la statistique fondatrice. Tout le produit, tout le pitch, tout le pricing s'articulent autour d'elle.

## 2.7 Le comportement du client final (le particulier en panne)

Comprendre le client de notre client est essentiel :

- **Urgence émotionnelle.** Fuite, panne de chauffage en hiver, porte claquée : le particulier est stressé, pressé, peu regardant sur le prix à l'instant T.
- **Comportement « premier qui décroche ».** Il appelle en cascade les numéros trouvés sur Google jusqu'à ce que quelqu'un réponde. Le premier qui décroche et rassure emporte le job.
- **Canal roi : Google.** La recherche « plombier + ville » ou la fiche Google Business est le point d'entrée n°1.
- **Preuve sociale.** Les avis Google pèsent lourd dans le choix.
- **Attente de rappel rapide.** Un rappel dans les minutes qui suivent un appel manqué peut encore sauver le job — d'où l'importance du rappel automatique.

## 2.8 Segmentation géographique de lancement

1. **Île-de-France (pilote, mois 0–3).** Densité maximale d'artisans et de demandes, terrain de test des design partners.
2. **France entière (mois 3–24).** Déploiement national, métier par métier.
3. **Belgique / Suisse romande / Luxembourg (mois 24–36).** Même langue, adaptation réglementaire légère, pouvoir d'achat élevé (Suisse = pricing premium).
4. **Europe non francophone (mois 36–48).** DACH, Espagne, Italie, avec localisation vocale.

## 2.9 Pourquoi ce marché sert l'objectif 100 M€

Le dépannage à domicile réunit les cinq conditions d'une hypercroissance :

1. **Douleur aiguë et chiffrable** → cycle de vente court.
2. **Base massive et fragmentée** → volume de clients atteignable.
3. **ROI immédiat** → rétention élevée, churn faible.
4. **Whitespace concurrentiel européen** → fenêtre de conquête.
5. **Réutilisation du build existant** → time-to-market court.

---
---

# TOME 3 — ANALYSE CONCURRENTIELLE

## 3.1 Cartographie des concurrents

On distingue **cinq familles** de concurrents, directes et indirectes :

1. **Les agents vocaux IA verticaux** (concurrence directe, émergente) — ex. acteur américain Avoca.
2. **Les télésecrétariats humains** (concurrence directe, historique) — permanences téléphoniques externalisées.
3. **Les logiciels de devis/facturation** (concurrence indirecte, installée) — Tolteck, Obat, Batappli, Vertuoza, etc.
4. **Les plateformes de génération de leads** (concurrence indirecte) — annuaires et places de marché de mise en relation.
5. **Le statu quo** (le vrai concurrent) — l'artisan qui décroche lui-même, ou pas.

## 3.2 Concurrent n°1 : l'agent vocal IA vertical (Avoca)

**Profil.** Startup américaine, agent vocal pour les métiers de services (CVC, plomberie, électricité). Valorisation ~1 Md$, plus de 800 clients, en route pour un volume d'un milliard de dollars de jobs réservés via sa plateforme. Répond à chaque appel entrant, qualifie, réserve dans le CRM, relance les devis.

**Ses forces :**

- Le concept est validé et financé massivement.
- Intégration profonde avec les CRM américains du secteur (ServiceTitan, Housecall Pro).
- Distribution physique efficace (salons, associations, ambassadeurs).
- Positionnement enterprise / multi-marques (opérateurs sous LBO, réseaux).

**Ses faiblesses — nos ouvertures :**

- **100 % anglophone (et espagnol US).** Aucune offre francophone native.
- **Branché sur des CRM américains** absents du marché européen.
- **Aucune conformité européenne** (RGPD, TVA bâtiment, facturation électronique FR).
- **Onboarding lourd**, orienté gros opérateurs avec centres d'appels — mal adapté à la TPE européenne.
- **Absent d'Europe.** Sa priorité est la conquête du marché américain.

**Notre stratégie face à lui :** occuper l'Europe francophone **avant** son arrivée, avec un produit natif (langue, CRM locaux ou CRM intégré, conformité), une adoption TPE ultra-simple, et une distribution via les fédérations françaises. La vitesse est notre arme décisive.

## 3.3 Concurrent n°2 : les télésecrétariats humains

**Profil.** Sociétés de permanence téléphonique qui décrochent au nom de l'artisan avec des opérateurs humains.

**Leurs forces :**

- L'humain rassure ; nuance et empathie réelles.
- Marché installé, habitudes prises.

**Leurs faiblesses — nos ouvertures :**

- **Coût élevé** (facturation à l'appel ou forfait cher).
- **Amplitude limitée** : rarement un vrai 24/7 à coût raisonnable.
- **Qualité variable** : opérateurs non spécialisés, scripts génériques.
- **Pas d'intégration** : le RDV n'est pas posé dans l'agenda, le devis n'est pas généré.
- **Ne scale pas** : chaque appel supplémentaire coûte un humain.

**Notre positionnement :** « Le télésecrétariat qui ne dort jamais, ne coûte pas un salaire, prend le RDV dans votre agenda et envoie le devis — pour une fraction du prix. »

## 3.4 Concurrent n°3 : les logiciels de devis/facturation

**Profil.** Éditeurs de devis/facture spécialisés bâtiment (Tolteck, Obat, Batappli, Vertuoza, Costructor, Graneet, Henrri, EBP, Sage). Marché mûr et concurrentiel, tarifs de ~15 à ~130 €/mois selon la profondeur.

**Leurs forces :**

- Bibliothèques de prix par métier, factures de situation, suivi de chantier.
- Bien installés, marques connues.

**Leur faiblesse structurelle — notre ouverture :**

- **Ce sont des outils passifs.** Ils *éditent un document*. Ils ne décrochent pas le téléphone, ne qualifient pas, ne prennent pas le RDV, ne relancent pas tout seuls. **Ils n'exécutent pas le travail.**

**Notre positionnement frontal :** « Eux éditent un devis. Nous, on décroche, on qualifie, on prend le RDV, on envoie le devis et on relance jusqu'à signature. Le logiciel attend que vous fassiez le travail ; Balia le fait. »

**Note stratégique :** ces éditeurs ne sont pas seulement des concurrents — ce sont de **futurs partenaires d'intégration** (phase 2). S'intégrer à Tolteck/Obat plutôt que les affronter frontalement est une option de distribution.

## 3.5 Concurrent n°4 : les plateformes de génération de leads

**Profil.** Annuaires et places de marché qui vendent des demandes de travaux aux artisans.

**Leurs faiblesses — nos ouvertures :**

- **Modèle détesté** : ils ponctionnent l'artisan par lead ou par commission, sans garantie de conversion.
- **Leads partagés** entre plusieurs artisans → guerre des prix.
- **Aucune exécution** : l'artisan doit quand même rappeler, qualifier, convertir.

**Notre positionnement :** on ne vend pas des leads, on **convertit les leads que l'artisan a déjà** (appels entrants, fiche Google, formulaires site). On maximise le retour sur ce qu'il paie déjà.

## 3.6 Concurrent n°5 : le statu quo (le vrai adversaire)

Le concurrent le plus fréquent n'est pas un produit, c'est l'habitude : **l'artisan décroche lui-même quand il peut, et laisse sonner sinon.**

**Comment on le bat :**

- En rendant la douleur **visible et chiffrée** (« vous avez raté 12 appels cette semaine, soit ~X 000 € »).
- En rendant l'essai **sans risque** (gratuit, sans engagement, live en 48h).
- En prouvant le ROI **en 14 jours** sur ses propres appels.

## 3.7 Tableau de synthèse concurrentielle

| Critère | Balia | Avoca | Télésecrétariat | Logiciel devis | Plateforme leads |
|---|---|---|---|---|---|
| Décroche 24/7 | ✅ | ✅ | ⚠️ partiel | ❌ | ❌ |
| Français natif | ✅ | ❌ | ✅ | ✅ | ✅ |
| Prend le RDV dans l'agenda | ✅ | ✅ | ⚠️ | ❌ | ❌ |
| Génère le devis | ✅ | ⚠️ | ❌ | ✅ | ❌ |
| Relance automatique | ✅ | ✅ | ❌ | ⚠️ | ❌ |
| Conformité FR/UE | ✅ | ❌ | ✅ | ✅ | ✅ |
| Coût maîtrisé / scale | ✅ | ✅ | ❌ | ✅ | ⚠️ |
| Ne ponctionne pas le CA | ✅ | ✅ | ✅ | ✅ | ❌ |

## 3.8 Notre moat (barrières à l'entrée que l'on construit)

1. **Langue & localisation** : voix française native, compréhension des accents et du jargon métier FR.
2. **Conformité** : RGPD, hébergement UE, TVA bâtiment, facturation électronique 2026.
3. **CRM local / CRM intégré** : on ne dépend pas d'un CRM américain ; on fournit le nôtre.
4. **Données propriétaires** : chaque appel traité affine nos modèles de qualification métier (flywheel de données).
5. **Distribution** : relations fédérations (CAPEB, FFB), distributeurs, ambassadeurs artisans.
6. **Vitesse** : occuper le terrain avant les acteurs américains.
7. **Réputation & preuve sociale** : études de cas chiffrées, bouche-à-oreille entre artisans.

---

## 3.9 CORRECTION IMPORTANTE : le marché francophone n'est PAS vide

⚠️ **Rectificatif assumé.** Une première version de cette Bible affirmait un « espace vierge » en Europe francophone. C'est faux et il faut le savoir : plusieurs acteurs français adressent déjà l'agent vocal IA pour artisans. L'honnêteté sur ce point conditionne la justesse du positionnement.

**Les acteurs francophones identifiés :**

| Acteur | Positionnement | Note |
|---|---|---|
| **AirAgent** | Agent vocal IA avec page dédiée plombier-chauffagiste ; identifie l'urgence, transfère l'appel critique | Le plus vertical côté FR |
| **Fonio** | Assistant téléphonique IA pour artisans (élec, plomberie, chauffage, garage…), à partir de ~0,15 €/min | Cible artisan directe |
| **LeadFlow AI** | Assistant vocal IA pour indépendants FR ; répond et prend les RDV | Cible solo |
| **Volubile** | Infrastructure vocale IA multi-agents, 400+ entreprises, TLS 1.3 / AES-256 | Posture sécurité/UE forte |
| **Vocalis / Nerolia / Newlink** | « Standard téléphonique IA » pour PME et artisans | Généralistes horizontaux |

**Prix de marché FR d'un standard IA :** ~300 à 1 500 €/mois pour du 24/7 (repère sectoriel).

**Infrastructure sous-jacente** (briques, pas concurrents) : ElevenLabs, Deepgram, Vapi, Retell, Bland. C'est notre boîte à outils.

**Ce que ça change :** la thèse n'est plus « personne n'est là », mais **« tout le monde fait un répondeur/standard IA générique ; personne ne fait l'employé complet, vertical, jusqu'au devis signé et au ROI prouvé, en français. »** Le marché est jeune, fragmenté, sans leader vertical installé. La fenêtre reste réelle mais se gagne par la **profondeur**, pas par le vide.

## 3.10 Ce qu'Avoca fait, que les Français ne font (quasiment) pas

Avoca n'est pas un répondeur : c'est une machine à revenus complète, structurée en trois piliers (Convert / Nurture / Coach).

1. **Cycle de revenu complet.** Donne une fourchette de prix, gère une objection, planifie, détecte une vraie urgence.
2. **Relance sortante acharnée.** Répond aux leads de toutes sources (Google, Angi, Thumbtack) et poursuit jusqu'à réservation ; travaille les devis dormants jusqu'à signature ou refus formel.
3. **Pilotage marketing/capacité.** Surveille l'occupation des techniciens et ajuste la dépense marketing selon les créneaux libres.
4. **Orchestration multi-marques / multi-sites** pour gros opérateurs et réseaux.
5. **Intégration profonde** aux CRM de terrain — mais **américains** (ServiceTitan, Housecall Pro), donc avantage nul en France.
6. **Échelle & capital** : 800+ opérateurs, flywheel de données, marque, 125 M$ levés.

→ Les Français s'arrêtent souvent à « décrocher + message/RDV + notification SMS ». Avoca va jusqu'au **cycle complet**.

## 3.11 Ce que les Français font, qu'Avoca ne fait pas

1. **Français natif** (voix, accents, jargon, contexte administratif FR). Avoca est anglophone/espagnol US — rédhibitoire pour un artisan français.
2. **Cible TPE/solo.** Avoca vise les opérateurs à centre d'appels et réseaux sous LBO ; surdimensionné et cher pour un plombier seul. Les FR (Fonio, LeadFlow, AirAgent) parlent à l'indépendant.
3. **Souveraineté / RGPD.** Avoca est cloud-only, souveraineté des données faible (2/5). Certains FR affichent une posture UE sérieuse (Volubile : TLS 1.3, AES-256).
4. **Présence ici et maintenant.** AirAgent a déjà une offre plombier-chauffagiste opérationnelle pendant qu'Avoca conquiert l'Amérique.

## 3.12 LE TROU DANS LA RAQUETTE — position pour écraser l'Europe

**Constat :** Avoca est **profond mais américain et enterprise**. Les Français sont **locaux mais superficiels** (répondeur/RDV). **Personne ne combine profondeur + natif FR + TPE.** C'est notre place.

**Position gagnante :** « La profondeur d'Avoca, en français, pour l'artisan — jusqu'au devis signé et au CA prouvé. »

**Les 6 piliers où l'on bat les deux camps à la fois :**

1. **Aller jusqu'au devis signé.** Devis avec TVA bâtiment (20/10/5,5 %) généré, envoyé, signé, relancé jusqu'à signature. Chaîne complète que personne ne possède en français.
2. **Prouver le CA récupéré en euros.** Dashboard « vous avez récupéré X 000 € ce mois-ci » au centre — ni les répondeurs FR, ni Avoca (enterprise) ne le font pour un solo.
3. **Simplicité TPE brutale.** Live en 48h par renvoi d'appel, sans CRM américain, sans centre d'appels. On prend le marché qu'Avoca ne veut pas et que les FR servent mal.
4. **Souveraineté & conformité UE** en argument frontal : hébergement UE, RGPD, facturation électronique 2026. Moat réglementaire qu'Avoca mettra des années à combler.
5. **Verticalité dépannage profonde** (pas un « standard IA » générique) : urgences plomberie/chauffage, jargon, tarification d'astreinte.
6. **Distribution physique française** (CAPEB, FFB, distributeurs, ambassadeurs) — le canal le plus dur à répliquer pour un Américain.

**Synthèse :** les répondeurs FR sont trop plats, Avoca est trop américain et trop enterprise. **Le milieu — profond, natif, TPE — est vide et c'est le plus gros segment.**

---

# TOME 4 — PERSONAS & PSYCHOLOGIE CLIENT

## 4.1 Persona principal — « Karim », le plombier-chauffagiste TPE

**Identité.** Karim, 42 ans, dirige une entreprise de plomberie-chauffage de 3 personnes en banlieue parisienne. 12 ans d'expérience, ancien salarié devenu patron. Marié, sa conjointe l'aide parfois sur l'administratif.

**Journée type.** Debout à 6h30, premier chantier à 8h. Il enchaîne les interventions jusqu'à 19h, les mains occupées. Son téléphone sonne en moyenne 30 fois par jour. Il en rate ~40 %. Le soir, il fait ses devis à 22h, épuisé, en retard, et oublie de relancer ceux de la semaine dernière.

**Outils actuels.** Un smartphone, un logiciel de devis (Tolteck ou Obat) qu'il utilise à moitié, un agenda papier ou Google Agenda. Pas de CRM. Pas de standard.

**Ses douleurs (par ordre d'intensité) :**

1. Les appels manqués = du CA perdu qu'il ne voit même pas.
2. Le temps administratif volé sur sa vie perso (devis le soir, relances jamais faites).
3. La difficulté à paraître aussi pro que les plus grosses boîtes.
4. La solitude de la gestion (il décide de tout, seul).

**Ses aspirations :**

- Ne plus perdre un seul client par manque de réponse.
- Récupérer ses soirées.
- Faire grossir sa boîte sans embaucher une secrétaire.

**Son déclencheur d'achat n°1 :** ne plus perdre de CA sur les appels manqués. C'est le message qui le fait signer.

**Ses freins :**

- Peur que l'IA parle mal à ses clients et lui fasse perdre en crédibilité.
- Méfiance envers « encore un logiciel » qu'il n'aura pas le temps d'apprendre.
- Aversion pour l'engagement long.

**Comment on le convainc :**

- Démo live : lui faire *entendre* l'agent décrocher un appel.
- Mode débordement (l'IA ne prend que ce qu'il ne prend pas → risque perçu minimal).
- ROI chiffré sur ses propres appels en 14 jours.
- Sans engagement + garantie 30 jours.

**Sa façon de payer :** CB en ligne ou prélèvement. Déteste s'engager sur 12 mois sans essai.

**Son aisance tech :** faible à moyenne. L'onboarding doit être quasi sans effort.

## 4.2 Persona secondaire — « Sandrine », l'artisan solo

**Identité.** Sandrine, 35 ans, électricienne indépendante, seule, en province. Micro-entreprise. Chaque appel manqué compte encore plus car elle n'a personne pour décrocher.

**Spécificités vs Karim :**

- Budget plus serré → l'offre d'entrée (Solo, 149 €/mois) est faite pour elle.
- Zéro back-office → notre mini-CRM/agenda intégré est indispensable (elle n'a aucun outil).
- Sensibilité prix maximale → le ROI doit être démontré au centime.

**Message qui la touche :** « Vous êtes seule à tout faire. Balia devient votre secrétaire, pour le prix d'un plein d'essence par semaine. »

## 4.3 Persona secondaire — « Jean-Pierre », le dirigeant de PME de dépannage

**Identité.** Jean-Pierre, 51 ans, dirige une entreprise de dépannage multi-services de 15 personnes avec plusieurs techniciens sur le terrain. Il a déjà une petite structure de standard, mais elle sature et coûte cher.

**Spécificités :**

- Volume d'appels élevé, plusieurs lignes, plusieurs techniciens à affecter.
- Besoin d'analytics (taux de conversion, appels par source, performance).
- Cible de l'offre PME (599 €/mois) avec multi-techniciens et multi-lignes.

**Message qui le touche :** « Remplacez un standard qui sature par un employé IA qui absorbe tous les pics, affecte le bon technicien et vous donne enfin la visibilité sur ce que vous ratez. »

## 4.4 Le client final (le particulier) — persona « Émilie »

**Identité.** Émilie, 38 ans, active, un dégât des eaux un dimanche soir. Elle cherche « plombier urgence » sur Google et appelle en cascade.

**Ce qu'elle attend :**

- Qu'on décroche vite.
- Qu'on la rassure et comprenne son problème.
- Qu'on lui donne un créneau ferme et une idée du prix.
- De la simplicité (SMS/WhatsApp de confirmation).

**Ce qui la fait fuir :**

- Le répondeur.
- Un standard robotique « tapez 1 ».
- L'incertitude sur le prix et le délai.

**Implication produit :** l'agent doit décrocher vite, parler naturellement, rassurer, et donner un créneau + une fourchette. La qualité de cet échange EST le produit.

## 4.5 Carte d'empathie (Karim)

- **Ce qu'il pense/ressent :** « Je bosse comme un fou mais je laisse filer de l'argent sans le voir. »
- **Ce qu'il voit :** ses concurrents qui décrochent, des avis Google, des pubs de logiciels.
- **Ce qu'il entend :** d'autres artisans qui se plaignent des mêmes galères, du bouche-à-oreille.
- **Ce qu'il dit/fait :** « J'ai pas le temps », il repousse, il bricole avec un renvoi vers sa femme.
- **Ses peines :** appels manqués, soirées volées, image.
- **Ses gains :** plus de CA, plus de temps, plus de sérénité.

## 4.6 Déclencheurs d'achat par persona

| Persona | Déclencheur | Message clé | Offre |
|---|---|---|---|
| Karim (TPE) | Perte de CA sur appels manqués | « Ne ratez plus jamais un client » | Pro 349 € |
| Sandrine (solo) | Seule, sature | « Votre secrétaire pour un plein d'essence/semaine » | Solo 149 € |
| Jean-Pierre (PME) | Standard qui sature | « Absorbez tous les pics, voyez ce que vous ratez » | PME 599 € |

## 4.7 Objections psychologiques récurrentes (traitées en détail au Tome 20)

1. « Mes clients vont détester parler à une machine. »
2. « J'ai peur que ça donne une mauvaise image. »
3. « C'est trop cher pour moi. »
4. « J'ai pas le temps de configurer un truc. »
5. « Et si l'IA dit une bêtise ou prend un mauvais RDV ? »
6. « Je préfère un humain. »

---
---

# TOME 5 — PHILOSOPHIE PRODUIT & PRINCIPES DIRECTEURS

## 5.1 Le principe fondateur : « On fait le boulot »

Chaque décision produit se juge à une seule aune : **est-ce que ça exécute une tâche que l'artisan déteste faire ?** Si une fonctionnalité se contente de « permettre à l'artisan de faire quelque chose plus facilement », elle est suspecte. Si elle **fait la chose à sa place**, elle est prioritaire.

## 5.2 Les 7 principes directeurs

1. **Autonomie avant assistance.** L'agent agit, il ne se contente pas de suggérer. Un RDV pris vaut mieux qu'un rappel « pensez à rappeler ce client ».
2. **Le téléphone d'abord.** Le vocal est le cœur. Tout le reste gravite autour de l'appel capté.
3. **Zéro friction d'adoption.** Live en 48h, sans compétence technique. Chaque étape d'onboarding retirée est une victoire.
4. **ROI visible en permanence.** Le dashboard répond en un coup d'œil à « combien Balia m'a rapporté ? ».
5. **Transparence assumée.** L'agent est une IA et le dit. On ne construit pas la confiance sur une tromperie.
6. **Sécurité du client final.** Une escalade vers l'humain est toujours possible ; l'agent sait dire « je passe le relais ».
7. **Simplicité brutale de l'interface.** L'artisan n'ouvre l'app que quelques secondes par jour. Chaque écran doit être compréhensible en 3 secondes.

## 5.3 L'architecture « monolithe intelligent »

Conformément à la vision Balia, l'expérience présentée à l'artisan est **un seul assistant** — pas une constellation d'outils. En interne, des micro-agents spécialisés (qualification, prise de RDV, devis, relance) collaborent, mais **de façon invisible**. L'artisan ne configure pas dix modules : il « embauche Balia », point.

## 5.4 Hiérarchie des fonctionnalités (MoSCoW)

**Must have (MVP, mois 0–3) :**

- Agent vocal qui décroche (débordement + 24/7).
- Qualification de l'appel.
- Prise de RDV dans un agenda.
- Génération de devis pré-rempli (template plomberie/chauffage).
- Relance des devis en attente.
- Multicanal Appel + SMS + WhatsApp.
- Dashboard « CA récupéré ».

**Should have (v1.5, mois 3–9) :**

- Chatbot web.
- Rappel automatique des appels manqués.
- Bibliothèque de prix affinée.
- Analytics avancés.

**Could have (v2, mois 9–18) :**

- Facturation (avec conformité 2026).
- Relance des impayés.
- Multi-techniciens avec affectation intelligente.
- Intégrations CRM tiers (Tolteck, Obat).
- Contrats d'entretien récurrents.

**Won't have (pour l'instant) :**

- Gestion de chantier / suivi de projet (Monde A).
- Comptabilité complète.
- Gestion de stock/matériaux.

## 5.5 Les moments de vérité de l'expérience

1. **Le premier appel capté** (l'artisan réalise que ça marche).
2. **Le premier RDV posé automatiquement** (il voit un créneau apparaître sans rien faire).
3. **Le premier devis signé après relance** (il touche du CA qu'il aurait perdu).
4. **Le premier « CA récupéré » affiché** (la preuve chiffrée).

Le produit doit orchestrer ces quatre moments dans les 14 premiers jours pour convertir l'essai.

## 5.6 Ce qui rend le produit défendable

- **La qualité conversationnelle métier** : l'agent connaît le vocabulaire plomberie/chauffage, les urgences typiques, les bonnes questions.
- **Le flywheel de données** : chaque appel améliore la qualification.
- **L'intégration bout-en-bout** : de l'appel au devis signé, sans couture.

---
---

# TOME 6 — L'AGENT VOCAL EN PROFONDEUR

## 6.1 Rôle et périmètre de l'agent vocal

L'agent vocal est le cœur du produit. Sa mission : **transformer chaque appel entrant en un résultat** (RDV pris, demande qualifiée, transfert pertinent) sans intervention humaine, à toute heure.

Périmètre fonctionnel :

- Décrocher (débordement ou 100 % selon config).
- Se présenter au nom de l'entreprise.
- Comprendre la demande et l'urgence.
- Collecter les informations nécessaires.
- Proposer et confirmer un créneau.
- Donner une fourchette de prix indicative.
- Envoyer une confirmation (SMS/WhatsApp).
- Transférer à l'humain si nécessaire.
- Journaliser l'appel pour le dashboard.

## 6.2 Design vocal (personnalité de l'agent)

- **Voix :** française naturelle, chaleureuse, professionnelle, rythme posé. Accent neutre au lancement.
- **Personnalité :** serviable, rassurante, efficace. Ni robotique, ni excessivement familière.
- **Ton adaptatif :** empathique en cas d'urgence stressante (« Je comprends, on va s'occuper de vous rapidement »), efficace pour une demande simple.
- **Identité :** l'agent se présente comme « l'assistant de [Nom de l'entreprise] ». Il confirme être un assistant virtuel si la question est posée.

## 6.3 Modes de fonctionnement

1. **Mode débordement (défaut au lancement).** L'agent ne prend que les appels non décrochés après X sonneries. Adoption facile, risque perçu minimal.
2. **Mode hors-horaires.** L'agent prend 100 % des appels en dehors des heures ouvrées (soir, nuit, week-end), avec tarification d'urgence.
3. **Mode standard complet (upsell).** L'agent prend 100 % des appels, en front. Pour les artisans convaincus ou les PME dont le standard sature.

## 6.4 Garde-fous & sécurité conversationnelle

- **Transfert à l'humain** déclenché si : urgence grave (fuite de gaz, danger), client très mécontent, demande hors périmètre, ou détresse détectée.
- **Anti-hallucination prix :** l'agent ne donne jamais un devis ferme au téléphone, seulement une **fourchette indicative** calibrée, et renvoie au devis officiel.
- **Anti-engagement abusif :** l'agent ne prend jamais un engagement qu'il ne peut tenir (« un technicien sera là dans 10 minutes » est interdit sans confirmation de dispo réelle).
- **Barge-in :** l'agent peut être interrompu et s'arrête pour écouter (conversation naturelle).
- **Gestion du silence / incompréhension :** relance polie, reformulation, puis transfert si blocage.

## 6.5 Chaîne technique de l'appel (pipeline)

```
Appel entrant (Twilio)
   → Détection décroché humain ? (mode débordement)
   → STT (speech-to-text) en flux
   → Moteur conversationnel (Claude API + logique métier)
   → Récupération contexte (agenda, tarifs, zone)
   → Génération réponse
   → TTS (text-to-speech) voix FR
   → Actions (poser RDV, envoyer SMS, créer lead)
   → Journalisation (transcript, résultat, durée)
```

Contraintes de latence : viser une réponse perçue **sous 1,5 seconde** pour préserver le naturel. Le barge-in doit couper le TTS instantanément.

## 6.6 Informations collectées à chaque appel

- Nature du problème (fuite, panne chaudière, pas d'eau chaude, court-circuit…).
- Niveau d'urgence (immédiat / aujourd'hui / cette semaine / programmé).
- Adresse et code postal (vérification zone d'intervention).
- Coordonnées (nom, téléphone rappelé, éventuellement email).
- Disponibilité du client.
- Type de logement / contexte utile (maison, appartement, syndic…).
- Éventuel budget ou attente de prix.

## 6.7 Estimation de prix au téléphone

L'agent :

- Donne une **fourchette indicative** basée sur la bibliothèque de tarifs de l'artisan (« Pour ce type d'intervention, comptez généralement entre X et Y euros, le montant exact sera précisé dans le devis »).
- Applique la **tarification d'urgence** si nuit/week-end.
- Ne s'engage jamais sur un prix ferme.

## 6.8 Gestion de l'astreinte et des urgences

- Détection du niveau d'urgence dès les premières secondes.
- Pour une urgence critique (dégât actif, danger), proposition du créneau le plus proche ou transfert immédiat à l'artisan d'astreinte.
- Application automatique du tarif de nuit/week-end, annoncé en transparence.

## 6.9 Multilingue (roadmap)

Français seul au lancement. L'architecture prévoit l'ajout de langues (néerlandais pour la Belgique, allemand/italien pour la Suisse, puis langues européennes) via des voix et modèles localisés.

## 6.10 Enregistrement & amélioration continue

- Enregistrement des appels **avec consentement** (annonce en début d'appel), hébergé en UE.
- Transcripts utilisés pour : preuve (dashboard, litiges), amélioration des scripts, entraînement de la qualification.
- Boucle qualité : revue des appels échoués/transférés pour affiner les scripts.

## 6.11 Métriques propres à l'agent vocal

- Taux de décroché (appels pris / appels reçus).
- Taux de résolution autonome (sans transfert humain).
- Taux de conversion appel → RDV.
- Durée moyenne d'appel.
- Latence moyenne de réponse.
- Score de satisfaction (via SMS post-appel optionnel).

---
---

# TOME 7 — SCRIPTS & FLUX CONVERSATIONNELS

> Les scripts ci-dessous sont des **trames**, pas des textes rigides. L'agent improvise dans le cadre, avec le ton défini au Tome 6. `[variable]` = donnée dynamique.

## 7.1 Flux principal — appel entrant standard

**Ouverture**

> « [Nom de l'entreprise] bonjour, je suis l'assistant de la société, comment puis-je vous aider ? »

**Écoute & compréhension du problème**

> Client : « J'ai une fuite sous mon évier. »
> Agent : « D'accord, une fuite sous l'évier. Est-ce que l'eau coule en continu en ce moment, ou c'est ponctuel ? »

**Qualification de l'urgence**

> Agent : « Je comprends. Pour vous proposer le bon créneau : est-ce que c'est urgent, vous avez besoin de quelqu'un aujourd'hui, ou on peut planifier dans les prochains jours ? »

**Localisation / zone**

> Agent : « Vous êtes bien dans le secteur de [zone] ? Pouvez-vous me donner votre code postal ? »

**Proposition de créneau**

> Agent : « Je peux vous proposer un passage [aujourd'hui entre 14h et 16h / demain matin]. Est-ce que ça vous convient ? »

**Fourchette de prix**

> Agent : « Pour ce type d'intervention, comptez généralement entre [X] et [Y] euros ; le montant exact vous sera confirmé dans le devis. »

**Collecte des coordonnées**

> Agent : « Je note. À quel nom et quel numéro je peux confirmer le rendez-vous ? »

**Confirmation & clôture**

> Agent : « C'est noté, [Prénom] : [type d'intervention], [date/heure], à [adresse]. Vous allez recevoir un SMS de confirmation. Autre chose ? Très bien, à bientôt, un technicien s'occupera de vous. »

## 7.2 Flux urgence critique (danger)

**Détection mots-clés :** « gaz », « odeur de gaz », « inondation », « électrocution », « fumée », « étincelle ».

> Agent : « Si vous sentez une odeur de gaz, ne touchez à aucun interrupteur, ouvrez les fenêtres et sortez. Je vous mets en relation immédiatement avec un technicien / je vous invite à appeler le [numéro d'urgence approprié]. »
> → **Transfert immédiat** vers l'artisan d'astreinte, ou consigne de sécurité + numéro d'urgence.

## 7.3 Flux hors-zone / hors-métier

> Agent : « Je suis désolé, nous n'intervenons pas sur [ce secteur / ce type de problème]. Je vous conseille de contacter [consigne]. Bonne journée. »
> → Lead journalisé comme « hors périmètre » (utile pour l'artisan qui voit la demande).

## 7.4 Flux client mécontent / litige

> Agent : « Je comprends votre mécontentement et je suis désolé pour ce désagrément. Je transmets immédiatement votre demande à [Nom], qui vous rappellera en priorité. Pouvez-vous me confirmer votre numéro ? »
> → Transfert / rappel prioritaire + notification à l'artisan.

## 7.5 Flux prise de RDV avec vérification agenda

1. Agent identifie le créneau souhaité par le client.
2. Agent interroge l'agenda temps réel.
3. Si disponible → propose et confirme.
4. Si indisponible → propose les deux créneaux libres les plus proches.
5. Pose le RDV, déclenche la confirmation SMS et le rappel J-1.

## 7.6 Flux rappel d'appel manqué (sortant)

Quand l'agent (ou l'artisan) n'a pas pu prendre un appel :

> Agent (rappel sous X minutes) : « Bonjour, vous avez appelé [entreprise] il y a quelques minutes, je vous rappelle pour vous aider. Vous aviez un souci de [contexte si connu] ? »

## 7.7 Flux relance de devis (voir Tome 10)

> Agent (J+3) : « Bonjour [Prénom], je reviens vers vous concernant le devis pour [intervention] envoyé le [date]. Avez-vous des questions, ou souhaitez-vous qu'on planifie l'intervention ? »

## 7.8 Gestion des cas conversationnels difficiles

- **Client qui parle vite / coupe :** barge-in actif, l'agent s'adapte au rythme.
- **Client qui teste l'IA (« t'es un robot ? ») :** « Je suis l'assistant virtuel de [entreprise], et je suis là pour vous trouver un créneau rapidement. On y va ? »
- **Bruit de fond / mauvaise ligne :** « Je vous entends mal, pouvez-vous répéter ? » puis, si blocage, proposition de rappel ou SMS.
- **Client indécis sur le créneau :** proposer deux options concrètes plutôt qu'une question ouverte.
- **Client hors sujet / bavard :** recentrage poli sur l'objectif (prendre le RDV).

## 7.9 Règles d'or des scripts

1. Toujours proposer **deux créneaux concrets** plutôt qu'une question ouverte.
2. Toujours **reformuler** le problème pour montrer qu'on a compris.
3. Toujours **confirmer** les détails à la fin (récap).
4. Ne jamais donner de **prix ferme**.
5. Ne jamais promettre un **délai** non vérifié.
6. Toujours **rassurer** en cas d'urgence.
7. Toujours **journaliser** le résultat de l'appel.

---
---

# TOME 8 — PRISE DE RENDEZ-VOUS & AGENDA

## 8.1 Principe

L'agent ne se contente pas de « noter une demande » : il **pose un rendez-vous ferme** dans un agenda temps réel, en vérifiant la disponibilité. C'est ce qui distingue Balia d'un simple répondeur ou télésecrétariat.

## 8.2 Agenda intégré vs agenda externe

- **Agenda Balia intégré (défaut).** La majorité des artisans n'ont aucun agenda structuré : Balia fournit le sien, simple et mobile.
- **Sync Google Agenda.** Pour ceux qui utilisent déjà Google, synchronisation bidirectionnelle.
- **Autres agendas :** roadmap (Outlook, agendas de CRM tiers).

## 8.3 Logique de créneaux

- **Créneaux d'urgence** : plages réservées aux interventions immédiates, tarif d'urgence.
- **Créneaux programmés** : interventions planifiables (entretien, install).
- **Zones tampons** : temps de trajet entre deux interventions pris en compte (roadmap : optimisation de tournée).

## 8.4 Multi-techniciens (v2)

- Affectation selon zone géographique, compétence (plombier vs chauffagiste), et charge.
- Vue agenda par technicien.
- Règles d'affectation configurables par l'artisan.

Au lancement : **agenda unique**, affectation manuelle si besoin.

## 8.5 Confirmations & rappels

- **Confirmation immédiate** post-RDV : SMS/WhatsApp avec récap (date, heure, adresse, intervention).
- **Rappel J-1** automatique pour réduire les lapins.
- **Rappel H-2** optionnel pour les urgences.

## 8.6 Annulations & reports

- L'agent gère annulations et reports en autonomie (le client rappelle, l'agent modifie l'agenda).
- Notification à l'artisan en cas de modification.
- Historique des modifications journalisé.

## 8.7 Réduction des rendez-vous manqués (no-shows)

- Rappels automatiques (J-1, H-2).
- Demande de confirmation active (« répondez OUI pour confirmer »).
- Journalisation des no-shows pour identifier les clients à risque.

## 8.8 Règles métier de l'agenda

1. Ne jamais double-booker un créneau.
2. Respecter les horaires d'ouverture configurés.
3. Appliquer le temps de trajet minimal entre interventions.
4. Réserver les créneaux d'urgence pour les vraies urgences.
5. Toujours confirmer par écrit un RDV posé oralement.

---

# TOME 9 — DEVIS

## 9.1 Principe

Après un appel qualifié, Balia **génère un devis pré-rempli** que l'artisan valide et envoie. L'artisan garde le contrôle final (validation), mais le travail fastidieux (rédaction, calcul, mise en forme) est fait.

## 9.2 Génération automatique

- À partir des informations collectées à l'appel (nature, contexte) et de la bibliothèque de prix de l'artisan.
- Pré-remplissage : intervention, lignes de prestation, quantités estimées, prix, TVA.
- L'artisan ajuste si besoin, puis valide.

## 9.3 Bibliothèque de prix

- **Template de départ** plomberie/chauffage fourni (interventions courantes : recherche de fuite, remplacement de joint, dépannage chaudière, débouchage, etc.).
- Personnalisable par l'artisan (ses tarifs, ses prestations).
- Enrichie au fil de l'usage.

## 9.4 Gestion de la TVA bâtiment

Application automatique des taux :

- **20 %** — travaux neufs / prestations standard.
- **10 %** — travaux d'amélioration, transformation, entretien de logements de plus de 2 ans.
- **5,5 %** — travaux d'amélioration de la performance énergétique.

Règles de TVA configurables et appliquées selon la nature de l'intervention.

## 9.5 Envoi & signature

- Envoi par **email + WhatsApp** (canaux préférés du client).
- **Signature électronique** intégrée (le client signe depuis son téléphone).
- Suivi du statut : envoyé / vu / signé / refusé.

## 9.6 Devis seulement au lancement (pas de facturation)

Au lancement, Balia gère le **devis**, pas la facture. Raison : éviter la charge de conformité de la facturation électronique 2026 (plateforme agréée) au démarrage. La facturation arrive en **v2**, via un partenaire de plateforme agréée.

## 9.7 Intégration avec les logiciels de devis existants

- **Phase 1 :** Balia fournit son propre devis léger.
- **Phase 2 :** intégration avec Tolteck/Obat (le devis Balia se pousse dans leur outil), pour ne pas forcer l'artisan à changer d'outil.

## 9.8 Suivi & relance des devis

Voir Tome 10. Chaque devis non signé entre automatiquement dans un cycle de relance.

## 9.9 Règles métier du devis

1. Aucun devis n'est envoyé sans validation de l'artisan (au lancement).
2. TVA appliquée automatiquement selon la nature.
3. Chaque devis a un statut suivi.
4. Chaque devis non signé déclenche une relance.
5. Mentions légales obligatoires incluses.

---
---

# TOME 10 — RELANCES (DEVIS & IMPAYÉS)

## 10.1 Principe

Les relances sont la source de CA « oubliée » de l'artisan. Un devis non relancé est souvent un devis perdu. Balia relance automatiquement, sans que l'artisan ait à y penser.

## 10.2 Relance des devis en attente (lancement)

**Cadence par défaut :**

- **J+1** : « Avez-vous bien reçu le devis ? »
- **J+3** : « Des questions ? Souhaitez-vous planifier ? »
- **J+7** : « Dernière relance : souhaitez-vous toujours réaliser l'intervention ? »

**Canaux :** SMS / WhatsApp / email selon préférence du client.

**Nombre max :** 3 relances, puis marquage « perdu » (l'artisan peut relancer manuellement).

**Ton :** cordial par défaut, personnalisable (cordial / ferme).

## 10.3 Relance des impayés (v2)

- Détection des factures échues.
- Séquence de relance graduée (rappel courtois → relance ferme → mise en demeure assistée).
- Ton configurable.
- Journalisation du CA recouvré.

## 10.4 Relance intelligente

- L'agent peut proposer un **rappel téléphonique** pour débloquer un devis hésitant.
- Il peut proposer un **créneau** directement dans la relance (« souhaitez-vous qu'on planifie mardi ? »).
- Il adapte le message au statut (devis vu mais non signé vs devis jamais ouvert).

## 10.5 Affichage du CA récupéré

Le dashboard affiche en permanence le **CA récupéré grâce aux relances** — un des chiffres-clés qui prouve la valeur de Balia.

## 10.6 Règles métier des relances

1. Ne jamais harceler : 3 relances max sur les devis.
2. Respecter les heures décentes (pas de SMS à 22h).
3. Adapter le canal à la préférence du client.
4. Toujours proposer une action concrète (planifier, rappeler).
5. Journaliser chaque relance et son résultat.

---

# TOME 11 — MULTICANAL & INBOX UNIFIÉE

## 11.1 Principe

Le client final contacte l'artisan par plusieurs canaux : appel, SMS, WhatsApp, formulaire web. Balia unifie tout dans une seule interface et répond sur chaque canal.

## 11.2 Canaux au lancement

- **Appel** (cœur, agent vocal).
- **SMS** (confirmations, relances, réponses).
- **WhatsApp Business** (canal fort en France, confirmations, devis, échanges).

## 11.3 Canaux fast-follow (v1.5)

- **Email** (devis, relances, échanges).
- **Chatbot web** (sur le site de l'artisan, qualification et prise de RDV en ligne).

## 11.4 Inbox unifiée

- Toutes les conversations, tous canaux confondus, dans une seule boîte de réception.
- Vue par client (historique complet des échanges).
- L'artisan peut reprendre la main à tout moment sur n'importe quel canal.

## 11.5 Continuité conversationnelle

- Un client qui appelle puis envoie un WhatsApp est reconnu : le contexte est conservé.
- Pas de rupture entre canaux.

## 11.6 WhatsApp comme canal stratégique

WhatsApp est massivement utilisé en France côté artisans et clients. Il sert à :

- Confirmer les RDV.
- Envoyer les devis et recueillir la signature.
- Relancer.
- Échanger des photos (utile pour pré-qualifier une panne).

## 11.7 Règles métier du multicanal

1. Un client = un fil unifié, quel que soit le canal.
2. L'artisan peut reprendre la main à tout instant.
3. Le canal de réponse s'adapte à la préférence du client.
4. Respect des règles de chaque canal (opt-in WhatsApp, horaires SMS).

---
---

# TOME 12 — ARCHITECTURE TECHNIQUE

## 12.1 Vue d'ensemble

Architecture « monolithe intelligent » : une expérience unifiée côté artisan, des micro-agents spécialisés en interne.

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTS FINAUX                        │
│   Appel · SMS · WhatsApp · Email · Web                   │
└───────────────┬─────────────────────────────────────────┘
                │
        ┌───────▼────────┐
        │  COUCHE CANAUX  │  Twilio (voix/SMS), WhatsApp API,
        │  (ingestion)    │  Email, Webchat
        └───────┬────────┘
                │
        ┌───────▼────────────────────┐
        │   ORCHESTRATEUR (monolithe) │
        │   Routage vers micro-agents │
        └───┬────┬────┬────┬─────────┘
            │    │    │    │
   ┌────────▼┐ ┌─▼───┐ ┌▼────┐ ┌▼──────┐
   │Qualif.  │ │RDV  │ │Devis│ │Relance│   ← micro-agents
   └────┬────┘ └─┬───┘ └┬────┘ └┬──────┘
        │        │      │       │
        └────────┴───┬──┴───────┘
                     │
        ┌────────────▼─────────────┐
        │   COUCHE DONNÉES (Supabase UE) │
        │   Clients, appels, RDV, devis  │
        └────────────┬─────────────┘
                     │
        ┌────────────▼─────────────┐
        │   INTERFACE ARTISAN       │
        │   Web + Mobile (dashboard)│
        └───────────────────────────┘
```

## 12.2 Stack technique

| Couche | Technologie | Rôle |
|---|---|---|
| Modèle IA | Claude API (Sonnet / Opus) | Compréhension, conversation, génération |
| Voix | Twilio + STT/TTS FR | Téléphonie, transcription, synthèse |
| Base de données | Supabase (région UE) | Données, auth, temps réel |
| Hébergement app | Vercel | Frontend + API |
| Paiement | Stripe | Abonnements, facturation |
| Messagerie | Twilio (SMS), WhatsApp Business API | Multicanal |
| Signature | Solution e-signature intégrée | Signature des devis |
| File de tâches | File de jobs (relances, rappels) | Orchestration asynchrone |

## 12.3 Contraintes techniques clés

- **Latence vocale** : réponse perçue < 1,5 s ; barge-in instantané.
- **Disponibilité** : 24/7, l'agent ne doit jamais « tomber » (un appel perdu = un client perdu).
- **Temps réel** : agenda et disponibilités en temps réel.
- **Résidence des données** : UE (RGPD).
- **Scalabilité** : absorber les pics d'appels (soir, week-end, vagues de froid pour le chauffage).

## 12.4 Sécurité

- Chiffrement en transit et au repos.
- Auth robuste (artisan).
- Cloisonnement des données par compte.
- Journalisation des accès.
- Consentement enregistrement d'appels.

## 12.5 Résilience

- Fallback si l'agent vocal échoue : message de repli + rappel programmé + notification artisan (jamais de silence total).
- Redondance téléphonie.
- Monitoring des appels en échec.

---

# TOME 13 — MODÈLE DE DONNÉES (SQL)

> Schéma indicatif (PostgreSQL / Supabase). À affiner par le lead technique.

## 13.1 Table `entreprises` (les artisans clients)

```sql
CREATE TABLE entreprises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    metier TEXT NOT NULL,              -- plomberie, chauffage, elec...
    telephone_principal TEXT,
    numero_balia TEXT,                 -- numéro de renvoi/agent
    email TEXT,
    adresse TEXT,
    zone_intervention JSONB,           -- codes postaux couverts
    horaires_ouverture JSONB,
    tarif_urgence JSONB,
    plan TEXT DEFAULT 'solo',          -- solo, pro, pme
    statut TEXT DEFAULT 'trial',       -- trial, actif, suspendu, churn
    date_creation TIMESTAMPTZ DEFAULT now(),
    trial_fin TIMESTAMPTZ
);
```

## 13.2 Table `utilisateurs`

```sql
CREATE TABLE utilisateurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entreprise_id UUID REFERENCES entreprises(id),
    nom TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'artisan',       -- artisan, technicien, admin
    telephone TEXT,
    date_creation TIMESTAMPTZ DEFAULT now()
);
```

## 13.3 Table `appels`

```sql
CREATE TABLE appels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entreprise_id UUID REFERENCES entreprises(id),
    numero_appelant TEXT,
    date_appel TIMESTAMPTZ DEFAULT now(),
    duree_secondes INT,
    mode TEXT,                         -- debordement, hors_horaire, complet
    resultat TEXT,                     -- rdv_pris, qualifie, transfere, hors_perimetre, perdu
    urgence TEXT,                      -- immediat, jour, semaine, programme
    transcript TEXT,
    enregistrement_url TEXT,
    ca_estime NUMERIC,                 -- valeur estimée récupérée
    transfere BOOLEAN DEFAULT false
);
```

## 13.4 Table `clients_finaux`

```sql
CREATE TABLE clients_finaux (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entreprise_id UUID REFERENCES entreprises(id),
    nom TEXT,
    telephone TEXT,
    email TEXT,
    adresse TEXT,
    code_postal TEXT,
    canal_prefere TEXT,                -- sms, whatsapp, email, appel
    date_creation TIMESTAMPTZ DEFAULT now()
);
```

## 13.5 Table `rendez_vous`

```sql
CREATE TABLE rendez_vous (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entreprise_id UUID REFERENCES entreprises(id),
    client_id UUID REFERENCES clients_finaux(id),
    appel_id UUID REFERENCES appels(id),
    technicien_id UUID REFERENCES utilisateurs(id),
    date_debut TIMESTAMPTZ,
    date_fin TIMESTAMPTZ,
    type TEXT,                         -- urgence, programme, entretien
    statut TEXT DEFAULT 'confirme',    -- confirme, annule, reporte, realise, no_show
    adresse TEXT,
    description TEXT,
    rappel_envoye BOOLEAN DEFAULT false
);
```

## 13.6 Table `devis`

```sql
CREATE TABLE devis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entreprise_id UUID REFERENCES entreprises(id),
    client_id UUID REFERENCES clients_finaux(id),
    rdv_id UUID REFERENCES rendez_vous(id),
    numero TEXT,
    lignes JSONB,                      -- prestations, quantités, prix
    montant_ht NUMERIC,
    montant_ttc NUMERIC,
    taux_tva NUMERIC,
    statut TEXT DEFAULT 'brouillon',   -- brouillon, envoye, vu, signe, refuse, perdu
    date_creation TIMESTAMPTZ DEFAULT now(),
    date_envoi TIMESTAMPTZ,
    date_signature TIMESTAMPTZ
);
```

## 13.7 Table `relances`

```sql
CREATE TABLE relances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    devis_id UUID REFERENCES devis(id),
    numero_relance INT,                -- 1, 2, 3
    canal TEXT,                        -- sms, whatsapp, email
    date_envoi TIMESTAMPTZ,
    resultat TEXT                      -- envoye, repondu, signe, ignore
);
```

## 13.8 Table `messages` (inbox unifiée)

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entreprise_id UUID REFERENCES entreprises(id),
    client_id UUID REFERENCES clients_finaux(id),
    canal TEXT,                        -- appel, sms, whatsapp, email, web
    direction TEXT,                    -- entrant, sortant
    contenu TEXT,
    date_message TIMESTAMPTZ DEFAULT now(),
    traite_par TEXT                    -- agent, humain
);
```

## 13.9 Table `abonnements`

```sql
CREATE TABLE abonnements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entreprise_id UUID REFERENCES entreprises(id),
    plan TEXT,                         -- solo, pro, pme
    prix_mensuel NUMERIC,
    quota_appels INT,
    appels_consommes INT DEFAULT 0,
    stripe_subscription_id TEXT,
    statut TEXT,                       -- actif, en_pause, annule
    date_debut TIMESTAMPTZ,
    date_renouvellement TIMESTAMPTZ
);
```

## 13.10 Relations principales

- Une `entreprise` a plusieurs `utilisateurs`, `appels`, `clients_finaux`, `rendez_vous`, `devis`.
- Un `appel` peut générer un `rendez_vous` et/ou un `devis`.
- Un `devis` a plusieurs `relances`.
- Un `client_final` a plusieurs `messages` (tous canaux).

---
---

# TOME 14 — SPÉCIFICATIONS API

> API REST indicative. Auth par token (JWT). Toutes les routes sont préfixées `/v1`. Réponses JSON.

## 14.1 Principes API

- REST, JSON, versionnée (`/v1`).
- Authentification par token Bearer.
- Idempotence sur les créations sensibles.
- Webhooks pour les événements temps réel (appel reçu, RDV pris, devis signé).
- Pagination sur les listes.

## 14.2 Endpoints — Entreprises

```
POST   /v1/entreprises              Créer une entreprise (onboarding)
GET    /v1/entreprises/:id          Détails
PATCH  /v1/entreprises/:id          Mettre à jour (zone, horaires, tarifs)
GET    /v1/entreprises/:id/stats    Statistiques (CA récupéré, appels, RDV)
```

## 14.3 Endpoints — Appels

```
GET    /v1/appels                   Lister les appels (filtres: date, resultat)
GET    /v1/appels/:id               Détails d'un appel (transcript, enregistrement)
POST   /v1/appels/:id/transfert     Forcer un transfert humain
GET    /v1/appels/:id/transcript    Transcript complet
```

## 14.4 Endpoints — Rendez-vous

```
POST   /v1/rendez-vous              Créer un RDV
GET    /v1/rendez-vous              Lister (filtres: date, statut, technicien)
PATCH  /v1/rendez-vous/:id          Modifier (report, annulation)
DELETE /v1/rendez-vous/:id          Annuler
GET    /v1/disponibilites           Créneaux disponibles (temps réel)
```

## 14.5 Endpoints — Devis

```
POST   /v1/devis                    Générer un devis (à partir d'un appel)
GET    /v1/devis/:id                Détails
PATCH  /v1/devis/:id                Modifier / valider
POST   /v1/devis/:id/envoyer        Envoyer (email/WhatsApp)
POST   /v1/devis/:id/signer         Enregistrer signature
GET    /v1/devis/:id/statut         Statut (envoyé/vu/signé)
```

## 14.6 Endpoints — Relances

```
POST   /v1/relances                 Déclencher une relance
GET    /v1/relances                 Lister les relances
```

## 14.7 Endpoints — Messages (inbox)

```
GET    /v1/messages                 Fil unifié (par client / canal)
POST   /v1/messages                 Envoyer un message (canal choisi)
```

## 14.8 Endpoints — Abonnements

```
GET    /v1/abonnements/:entrepriseId   État de l'abonnement
POST   /v1/abonnements/upgrade          Changer de palier
GET    /v1/abonnements/:id/consommation Quota d'appels consommé
```

## 14.9 Webhooks (événements poussés)

```
appel.recu             Un appel entrant est arrivé
appel.termine          Un appel s'est terminé (avec résultat)
rdv.pris               Un RDV a été posé
rdv.modifie            Un RDV a été modifié/annulé
devis.envoye           Un devis a été envoyé
devis.signe            Un devis a été signé
relance.envoyee        Une relance a été envoyée
transfert.declenche    Un transfert humain a été déclenché
```

## 14.10 Exemple de payload — création de RDV

```json
POST /v1/rendez-vous
{
  "entreprise_id": "uuid",
  "client": {
    "nom": "Émilie D.",
    "telephone": "+33...",
    "adresse": "12 rue...",
    "code_postal": "75011"
  },
  "date_debut": "2026-07-21T14:00:00+02:00",
  "date_fin": "2026-07-21T16:00:00+02:00",
  "type": "urgence",
  "description": "Fuite sous évier"
}
```

## 14.11 Codes d'erreur standard

```
400  Requête invalide
401  Non authentifié
403  Non autorisé (cloisonnement entreprise)
404  Ressource introuvable
409  Conflit (ex: double-booking)
422  Données invalides (ex: TVA incohérente)
429  Trop de requêtes
500  Erreur serveur
```

---

# TOME 15 — INTÉGRATIONS TIERCES

## 15.1 Priorités de lancement

1. **Twilio** — téléphonie (voix + SMS). Cœur du wedge.
2. **WhatsApp Business API** — confirmations, devis, relances.
3. **Google Agenda** — synchronisation des RDV.
4. **Google Business Profile** — captation des appels depuis la fiche, gestion des avis.
5. **Stripe** — abonnements et paiements.
6. **Mini-CRM/agenda Balia intégré** — pour les artisans sans outil.

## 15.2 Intégrations phase 2

- **Logiciels de devis** (Tolteck, Obat) — pousser le devis Balia dans leur outil.
- **Plateformes de leads** — rappeler instantanément les leads entrants.
- **Compta / facturation** (via plateforme agréée) — pour la facturation v2.
- **Outlook / autres agendas**.

## 15.3 Google Business Profile — pourquoi c'est prioritaire

La fiche Google est le point d'entrée n°1 des demandes de dépannage. Intégration pour :

- Capter les appels issus de la fiche.
- Répondre aux avis (roadmap).
- Améliorer le référencement local (indirectement, via le taux de réponse).

## 15.4 Stratégie « CRM intégré d'abord »

La majorité des artisans n'ont aucun CRM. Plutôt que de dépendre d'intégrations tierces dès le départ, Balia fournit son **propre mini-CRM/agenda**. Les intégrations tierces viennent ensuite pour ceux qui ont déjà un outil.

## 15.5 Règles d'intégration

1. Ne jamais bloquer l'onboarding sur une intégration tierce.
2. Le CRM intégré est le défaut ; les intégrations sont un plus.
3. Chaque intégration doit être testable en < 5 minutes.

---
---

# TOME 16 — ONBOARDING & ACTIVATION

## 16.1 Objectif : live en 24–48h

L'onboarding est un facteur de survie. Cible : l'artisan est opérationnel en **24 à 48 heures**, sans compétence technique.

## 16.2 Parcours d'onboarding (wizard)

1. **Inscription** (email, mot de passe, métier).
2. **Configuration de l'entreprise** : nom, zone d'intervention (codes postaux), horaires d'ouverture, tarifs d'urgence.
3. **Configuration de l'agent** : nom de l'entreprise annoncé, ton, script de base (pré-rempli pour la plomberie/chauffage).
4. **Branchement du numéro** : mise en place du renvoi d'appel (guide pas-à-pas selon l'opérateur).
5. **Test** : l'artisan appelle son propre numéro et entend l'agent.
6. **Go live**.

## 16.3 Self-service + accompagnement

- **Self-service guidé** par défaut (wizard clair).
- **Call d'onboarding optionnel** (15 min) pour les moins à l'aise ou les PME.
- **Support réactif** (chat, téléphone) pendant les premiers jours.

## 16.4 Le branchement du numéro (point critique)

- **Renvoi d'appel** depuis le numéro existant (pas de portabilité) → zéro coupure d'activité.
- Guide pas-à-pas par opérateur (codes de renvoi).
- Alternative : numéro Balia fourni, à afficher progressivement.

## 16.5 Essai gratuit

- **14 jours, sans carte bancaire** (maximise le haut de funnel vu le persona méfiant).
- Objectif : que l'artisan vive les **4 moments de vérité** (premier appel capté, premier RDV, premier devis signé, premier CA récupéré affiché) avant la fin de l'essai.

## 16.6 Activation & « aha moment »

L'activation est atteinte quand l'artisan **voit son premier appel capté et son premier RDV posé automatiquement**. Tout l'onboarding vise à provoquer ce moment le plus vite possible.

## 16.7 Métriques d'onboarding

- Temps jusqu'au go-live (cible < 48h).
- Taux de complétion du wizard.
- Temps jusqu'au premier appel capté.
- Taux de conversion essai → payant.

## 16.8 Réduction du churn précoce

- Séquence de bienvenue (jour 1, 3, 7, 14).
- Affichage précoce du ROI (CA récupéré).
- Alerte si aucun appel capté après X jours (risque de mauvaise config du renvoi).

---

# TOME 17 — PRICING & PACKAGING

## 17.1 Modèle : abonnement + outcome, zéro commission sur le CA

Décision verrouillée : **aucune commission sur le chiffre d'affaires de l'artisan.** L'artisan déteste être ponctionné. On facture un abonnement + un usage à l'outcome (appel traité au-delà du quota).

## 17.2 Grille tarifaire

| Palier | Prix/mois | Cible | Inclus |
|---|---|---|---|
| **Solo** | **149 €** | Artisan seul | Débordement + hors-horaires, qualification, relance devis, 1 canal vocal, quota d'appels de base |
| **Pro** ⭐ | **349 €** | TPE 2–10 | 24/7, multicanal (appel/SMS/WhatsApp), RDV agenda, devis auto, relances, dashboard, quota étendu |
| **PME** | **599 €** | 10–20 pers. | Multi-techniciens, multi-lignes, priorité de traitement, analytics avancés, quota élevé |

- **Outcome** : quota d'appels traités inclus par palier ; **facturation à l'appel traité au-delà du quota**.
- **Engagement** : sans engagement, ou **annuel = 2 mois offerts**.
- **Setup** : aucun frais de mise en service.
- **Essai** : 14 jours gratuits, sans CB.
- **Géo** : pricing premium en Suisse (+30 à 40 %).

## 17.3 Logique de packaging

- Le **Pro** est le cœur de gamme (ancré visuellement comme « le plus populaire »).
- Le **Solo** est la porte d'entrée à faible friction pour les indépendants.
- Le **PME** capture la valeur des structures à fort volume.

## 17.4 Justification du prix (ancrage sur le ROI)

Le prix se justifie par le CA récupéré, pas par un coût. Argumentaire :

> « Vous ratez ~10 appels par jour. Si Balia vous en récupère ne serait-ce que 3, et qu'une intervention moyenne vaut [X] €, vous récupérez [Y] € par mois. Balia coûte [prix]. Le calcul est vite fait. »

## 17.5 ACV moyen visé

- ACV moyen blended visé : **~2 500 €/an** (mix Solo/Pro/PME + outcome + upsell).
- C'est la brique du calcul 100 M€ (40 000 × 2 500 €).

## 17.6 Leviers d'expansion (NRR)

- Passage Solo → Pro → PME.
- Ajout de canaux.
- Ajout de la facturation (v2).
- Ajout de la relance impayés (v2).
- Dépassement de quota (outcome).

## 17.7 Politique de remises

- Annuel : 2 mois offerts.
- Parrainage : mois offert pour le parrain et le filleul.
- Fédérations / partenariats : offre négociée (volume).

## 17.8 Ce qu'on ne fait pas

- Pas de freemium permanent (l'essai 14j suffit).
- Pas de commission sur le CA.
- Pas de tarification opaque à l'appel façon télésecrétariat.

---
---

# TOME 18 — MODÈLE FINANCIER & TRAJECTOIRE 100 M€

## 18.1 L'équation cible

> **40 000 clients actifs × ACV moyen ~2 500 €/an = 100 M€ ARR.**

## 18.2 Trajectoire annuelle (scénario cible)

> Ces chiffres sont une **trajectoire cible** (top-décile de la catégorie agents IA verticaux), pas une prévision garantie. Ils servent de boussole.

| Année | Clients actifs (fin) | ACV moyen | ARR (fin) | Commentaire |
|---|---|---|---|---|
| **An 1** | ~1 000 | ~2 000 € | ~2 M€ | Design partners → premiers payants, France plomberie/chauffage |
| **An 2** | ~7 000 | ~2 300 € | ~16 M€ | Scale France, métiers adjacents, début facturation/impayés |
| **An 3** | ~20 000 | ~2 400 € | ~48 M€ | Expansion francophone (BE/CH/LU), NRR en hausse |
| **An 4** | ~40 000 | ~2 500 € | ~100 M€ | Europe + verticales-sœurs, machine de croissance rodée |

## 18.3 Ce que cette trajectoire suppose

- **Un churn faible** (ROI immédiat → rétention forte). Cible : churn logo mensuel < 2–3 %.
- **Un NRR > 100 %** (expansion par palier + modules).
- **Un CAC payback court** (< 12 mois) grâce à un cycle de vente rapide.
- **Une levée de fonds** pour financer l'acquisition (après la preuve).
- **Une machine d'acquisition** capable de recruter des milliers d'artisans par an.

## 18.4 Économie unitaire (cible)

| Métrique | Cible |
|---|---|
| ACV moyen | ~2 500 €/an |
| Marge brute | 70–80 % (coûts : voix, compute, téléphonie) |
| CAC | < ACV (payback < 12 mois) |
| LTV/CAC | > 3 |
| Churn logo mensuel | < 2–3 % |
| NRR | > 100 % |

## 18.5 Structure de coûts

- **COGS** : téléphonie (Twilio), STT/TTS, compute LLM (Claude API), infrastructure. → surveiller la marge brute (les coûts voix/compute pèsent).
- **S&M** : acquisition (le plus gros poste en hypercroissance).
- **R&D** : produit, agent vocal, intégrations.
- **G&A** : support, ops, admin.

## 18.6 Financement

- **Amorçage (autofinancé)** : MVP + 10–20 design partners.
- **Seed** : après preuve du ROI, pour financer la première machine d'acquisition (BPI, business angels, VC seed).
- **Série A** : pour scaler l'acquisition et lancer l'expansion géo.
- 🔴 **Arbitrage fondateur** : accepter la dilution nécessaire pour viser 100 M€, tout en maximisant la valo à chaque tour grâce à la preuve accumulée.

## 18.7 Sensibilité (leviers du modèle)

Les trois leviers qui font ou défont le 100 M€ :

1. **Le churn** (si le ROI n'est pas prouvé, tout s'effondre).
2. **Le coût d'acquisition** (si le CAC dérape, la machine cale).
3. **L'ACV** (l'expansion via modules et paliers est décisive).

---

# TOME 19 — GO-TO-MARKET

## 19.1 Phase 0 — Design partners (mois 0–3)

- **Objectif** : 10–20 plombiers/chauffagistes en Île-de-France, setup fait main.
- **Livrable** : preuve de ROI chiffrée (CA récupéré), témoignages, 1 artisan ambassadeur.
- **Arme de vente n°1** : la démo live « écoute l'IA décrocher un appel ».

## 19.2 Phase 1 — Scale France plomberie/chauffage (mois 3–12)

Canaux, dans l'ordre de test et de priorité :

1. **Cold call + démo live.** Le persona se vend à l'oreille.
2. **Groupes Facebook d'artisans** + contenu terrain.
3. **Parrainage artisan → artisan.** Le métier fonctionne au bouche-à-oreille.
4. **Meta ads** ciblées (retargeting, lookalikes).
5. **Fédérations** (CAPEB, FFB, syndicats plombiers-chauffagistes).
6. **Distributeurs** (Cédéo, Point.P, Saint-Gobain) qui ont l'accès aux artisans.
7. **Salons pros** (Interclima et équivalents).

## 19.3 Phase 2 — Extension métiers & modules (mois 12–24)

- Métiers-frères : électricité, serrurerie, vitrerie.
- Modules : facturation, relance impayés, multi-techniciens.
- Intégrations CRM tiers.

## 19.4 Phase 3 — Europe & verticales-sœurs (mois 24–48)

- Géo : Belgique, Suisse, Luxembourg → DACH, Espagne, Italie (localisation vocale).
- Verticales-sœurs à moteur identique : santé de proximité, auto après-vente.

## 19.5 Playbook de vente

1. **Accroche** : « Combien d'appels vous ratez par semaine ? »
2. **Douleur chiffrée** : traduire les appels manqués en euros perdus.
3. **Démo live** : faire entendre l'agent.
4. **Essai sans risque** : 14 jours gratuits, sans CB, live en 48h.
5. **Preuve** : à J+14, montrer le CA récupéré sur ses propres appels.
6. **Closing** : sans engagement + garantie 30 jours.

## 19.6 Distribution physique (le facteur sous-estimé)

Le succès dans les métiers du bâtiment passe par la présence physique : salons, fédérations, distributeurs, ambassadeurs. C'est le canal qu'un acteur américain aura le plus de mal à répliquer en Europe. **On en fait une priorité, pas une arrière-pensée.**

## 19.7 Contenu & marque

- Témoignages vidéo d'artisans (preuve sociale).
- Calculateur « combien vous perdez en appels manqués ».
- Contenu pédagogique sur les réseaux fréquentés par les artisans.

## 19.8 Programme ambassadeur

Un artisan référent (façon design partner emblématique) qui témoigne et parraine. Il devient la preuve vivante et le relais dans sa communauté.

---
---

# TOME 20 — SALES KIT & TRAITEMENT DES OBJECTIONS

## 20.1 Le pitch en 30 secondes

> « Vous êtes plombier, vous êtes sur les chantiers toute la journée, et pendant ce temps votre téléphone sonne dans le vide. Chaque appel manqué, c'est un client qui appelle le concurrent d'à côté — ça représente jusqu'à un quart de votre chiffre d'affaires. Balia, c'est un assistant qui décroche à votre place 24h/24, comprend le problème, prend le rendez-vous dans votre agenda et envoie le devis. Vous ne ratez plus jamais un client. Essai gratuit, live en 48h, sans engagement. »

## 20.2 Le pitch en 10 secondes (elevator)

> « Balia décroche le téléphone à votre place, prend les rendez-vous et envoie les devis — pour que vous ne ratiez plus jamais un client. »

## 20.3 La démo comme arme de vente

La démo la plus puissante : **faire entendre l'agent décrocher un appel en direct.** L'artisan doit *entendre* la qualité de la voix et la fluidité. C'est ce qui lève 80 % des objections d'un coup.

## 20.4 Table des objections & réponses

| # | Objection | Réponse |
|---|---|---|
| 1 | « Mes clients vont détester parler à une machine. » | « Écoutez la démo — la plupart ne se rendent pas compte. Et de toute façon, aujourd'hui vos clients tombent sur un répondeur ou personne. Une IA qui décroche et prend le RDV, c'est infiniment mieux qu'un appel perdu. » |
| 2 | « J'ai peur pour mon image. » | « L'agent parle au nom de votre entreprise, avec le ton que vous choisissez. Et il commence en mode débordement : il ne prend QUE les appels que vous ne pouvez pas prendre. Vous ne perdez rien, vous récupérez. » |
| 3 | « C'est trop cher. » | « Combien vaut une intervention pour vous ? Si Balia vous récupère ne serait-ce qu'un client par semaine, il est déjà rentabilisé plusieurs fois. Ce n'est pas un coût, c'est du CA récupéré. » |
| 4 | « J'ai pas le temps de configurer un truc. » | « Vous êtes live en 48h, et on vous accompagne. La config, c'est votre zone, vos horaires, vos tarifs — 20 minutes, une fois. » |
| 5 | « Et si l'IA dit une bêtise ou prend un mauvais RDV ? » | « L'agent ne s'engage jamais sur un prix ferme ni un délai non vérifié, et il transfère à vous en cas de doute. Vous validez les devis avant envoi. Vous gardez le contrôle. » |
| 6 | « Je préfère un humain. » | « Un humain ne décroche pas à 2h du matin, tombe malade et coûte un salaire. Balia complète votre équipe : il prend ce que vous ne pouvez pas prendre. » |
| 7 | « J'ai déjà un logiciel de devis. » | « Parfait — Balia ne le remplace pas, il fait ce que votre logiciel ne fait pas : décrocher, qualifier, prendre le RDV. Votre logiciel édite un devis ; Balia va chercher le client. » |
| 8 | « Je veux réfléchir. » | « Bien sûr. L'essai est gratuit, sans CB, sans engagement. Le meilleur moyen de réfléchir, c'est de voir sur VOS appels combien vous en ratez. On lance l'essai ? » |
| 9 | « Je ne suis pas sûr que ça marche pour mon métier. » | « On démarre sur la plomberie et le chauffage — l'agent connaît le vocabulaire, les urgences typiques, les bonnes questions. C'est fait pour vous. » |
| 10 | « Comment je sais que ça me rapporte vraiment ? » | « Le tableau de bord affiche le CA récupéré, en euros, sur vos propres appels. Vous le voyez noir sur blanc dès les premiers jours. » |
| 11 | « Et mes données / le RGPD ? » | « Tout est hébergé en Europe, conforme RGPD, et les appels ne sont enregistrés qu'avec consentement. » |
| 12 | « Je peux arrêter quand je veux ? » | « Oui, sans engagement, et garantie satisfait ou remboursé 30 jours. Le risque est de notre côté, pas du vôtre. » |

## 20.5 Cas d'usage à raconter (storytelling de vente)

- **Le dimanche soir sauvé** : un dégât des eaux à 21h, Balia décroche, qualifie, pose le RDV pour le lendemain 8h. Sans Balia, ce client appelait le concurrent.
- **Les devis qui dorment** : 8 devis en attente, Balia relance, 3 signent. CA récupéré immédiat.
- **La vague de froid** : chute des températures, explosion des appels chaudière. Balia absorbe le pic sans que l'artisan lâche son chantier.

## 20.6 Signaux d'achat & closing

- Signaux : l'artisan demande le prix, parle de « ses » appels manqués, demande comment brancher son numéro.
- Closing : proposer immédiatement de lancer l'essai (« on branche votre numéro maintenant, vous verrez le premier appel capté dès aujourd'hui »).

---

# TOME 21 — MARQUE, TON & MESSAGING

## 21.1 Positionnement de marque

**Balia — l'employé IA qui décroche pour les artisans.** Proche du terrain, ROI concret, sans jargon. Pas une marque « tech froide », une marque « alliée de l'artisan ».

## 21.2 Promesse de marque

**« Ne ratez plus jamais un client. »**

## 21.3 Piliers de messaging

1. **On fait le boulot** (pas un outil de plus).
2. **Vous ne ratez plus rien** (chaque appel capté).
3. **ROI prouvé** (CA récupéré en euros).
4. **Simple et sans risque** (live en 48h, sans engagement).

## 21.4 Ton de voix

- **Direct et concret.** On parle argent, appels, RDV — pas « synergie » et « disruption ».
- **Chaleureux et respectueux** du métier d'artisan.
- **Rassurant** (on désamorce la peur de l'IA).
- **Preuve avant promesse.**

## 21.5 Ce qu'on dit / ce qu'on ne dit pas

- ✅ « Balia décroche, qualifie, prend le RDV. »
- ✅ « Vous avez récupéré X € ce mois-ci. »
- ❌ Jargon IA abstrait (« LLM », « agents », « orchestration »).
- ❌ Promesses non chiffrées et invérifiables.

## 21.6 Nom & architecture de marque

- **Balia** = marque mère.
- Sous-titre marché dépannage : « l'assistant qui décroche pour les artisans ».
- La verticale immobilier (si maintenue) devient une déclinaison sœur.

---
---

# TOME 22 — RGPD, CONFORMITÉ & LÉGAL

## 22.1 Principes de conformité

- **Hébergement des données en Union Européenne** (Supabase région UE) dès le jour 1.
- **RGPD by design** : minimisation des données, finalité claire, durée de conservation définie.
- **Transparence IA** : l'agent se présente comme un assistant virtuel.

## 22.2 Enregistrement des appels

- Enregistrement **avec consentement** (annonce en début d'appel).
- Finalités : preuve, amélioration du service, formation des modèles internes.
- Durée de conservation définie et documentée.
- Droit d'accès et de suppression respectés.

## 22.3 Données personnelles traitées

- Données de l'artisan (entreprise, contact).
- Données du client final (nom, téléphone, adresse, demande).
- Transcripts et enregistrements d'appels.
- Base légale : exécution du service / intérêt légitime / consentement selon les cas.

## 22.4 Facturation électronique 2026

- Au lancement : **devis uniquement**, pas de facture → on évite la charge de conformité de la facturation électronique.
- En v2 : facturation via un **partenaire plateforme agréée** conforme à la réforme.

## 22.5 TVA bâtiment

- Application correcte des taux (20 / 10 / 5,5 %) selon la nature des travaux.
- Mentions légales obligatoires sur les devis.

## 22.6 Consommateur & droit de la vente à distance

- Respect des règles applicables aux devis et à la signature électronique.
- Mentions d'information précontractuelle.

## 22.7 Sous-traitance & partenaires

- Contrats de sous-traitance RGPD avec les fournisseurs (téléphonie, IA, hébergement).
- Cartographie des flux de données.

## 22.8 Points de vigilance juridique

- Transparence sur la nature IA de l'agent.
- Consentement à l'enregistrement.
- Localisation des données.
- Responsabilité en cas d'erreur de l'agent (cadrée : l'artisan valide les devis, l'agent ne s'engage pas sur un prix ferme).

---

# TOME 23 — GESTION D'ERREURS & CAS LIMITES

## 23.1 Philosophie

Un appel perdu = un client perdu. La règle d'or : **jamais de silence total.** En cas de défaillance, il y a toujours un filet (message de repli + rappel + notification artisan).

## 23.2 Cas limites de l'agent vocal

| Cas | Comportement attendu |
|---|---|
| L'agent ne comprend pas | Reformulation, puis transfert ou proposition de rappel |
| Mauvaise qualité de ligne | « Je vous entends mal », puis SMS/rappel |
| Client agressif | Ton calme, transfert prioritaire |
| Urgence vitale (gaz, danger) | Consignes de sécurité + transfert/numéro d'urgence |
| Demande hors périmètre | Orientation polie, lead journalisé |
| Client qui veut absolument un humain | Transfert ou promesse de rappel |
| Silence prolongé | Relance, puis clôture polie |
| Appel simultané (plusieurs lignes) | File / mode multi-lignes (PME) |

## 23.3 Cas limites de l'agenda

- Double-booking évité par verrou temps réel.
- Créneau devenu indisponible pendant l'appel → proposition alternative immédiate.
- Fuseau horaire / changement d'heure gérés.

## 23.4 Cas limites du devis

- Bibliothèque de prix incomplète → devis avec ligne « à préciser » + alerte artisan.
- TVA ambiguë → taux par défaut + demande de confirmation.

## 23.5 Défaillances techniques

- Panne téléphonie → bascule sur redondance + notification.
- Panne IA → message de repli + rappel programmé.
- Panne base de données → mode dégradé (capture minimale : numéro + rappel).

## 23.6 Monitoring & alertes

- Surveillance des appels en échec.
- Alerte si un compte ne capte aucun appel (config renvoi ratée).
- Alerte latence vocale anormale.
- Journalisation exhaustive pour post-mortem.

## 23.7 Boucle d'amélioration

- Revue hebdomadaire des appels transférés/échoués.
- Affinage des scripts et de la qualification.
- Enrichissement de la bibliothèque de prix.

---

# TOME 24 — MÉTRIQUES, KPIs & DASHBOARDS

## 24.1 Les 3 métriques nord

1. **CA récupéré par client** — la preuve de valeur (le chiffre roi).
2. **Taux d'appels décrochés & récupérés** — l'efficacité du wedge.
3. **Rétention / NRR** — la santé du business.

## 24.2 Métriques produit

- Taux de décroché.
- Taux de résolution autonome (sans transfert).
- Taux de conversion appel → RDV.
- Taux de signature des devis (après relance).
- Latence vocale moyenne.
- Satisfaction client final (SMS post-appel).

## 24.3 Métriques business

- MRR / ARR.
- Nombre de clients actifs.
- ACV moyen.
- Churn logo mensuel.
- NRR.
- CAC & CAC payback.
- LTV / CAC.

## 24.4 Métriques d'acquisition

- Coût par lead / par canal.
- Taux de conversion démo → essai → payant.
- Temps de cycle de vente.
- Sources d'acquisition les plus rentables.

## 24.5 Métriques d'onboarding & activation

- Temps jusqu'au go-live.
- Taux de complétion du wizard.
- Temps jusqu'au premier appel capté.
- Taux de conversion essai → payant.

## 24.6 Le dashboard artisan (ce qu'il voit)

- **En haut, énorme : le CA récupéré ce mois-ci** (en euros).
- Appels captés / RDV pris / devis signés.
- Agenda du jour.
- Inbox unifiée.
- Devis en attente / relances en cours.

## 24.7 Le dashboard interne (ce qu'on pilote)

- ARR, clients, churn, NRR.
- Performance par canal d'acquisition.
- Santé produit (latence, taux de transfert).
- Cohortes de rétention.

---
---

# TOME 25 — REGISTRE DES RISQUES

## 25.1 Matrice des risques majeurs

| # | Risque | Impact | Probabilité | Mitigation |
|---|---|---|---|---|
| R1 | Adoption : l'artisan ne fait pas confiance à une IA au téléphone | Élevé | Moyenne | Mode débordement, démo live, garantie 30j |
| R2 | Qualité de la voix FR insuffisante | Élevé | Moyenne | Investir tôt dans la brique vocale, itérer sur les transcripts |
| R3 | Onboarding trop complexe (renvoi d'appel) | Élevé | Moyenne | Guides opérateur, accompagnement, alerte config ratée |
| R4 | Avoca (ou un concurrent) arrive vite en Europe | Élevé | Moyenne | Vitesse d'occupation, moat langue/localisation/distribution |
| R5 | Marges compressées par les coûts voix/compute | Moyen | Moyenne | Optimisation technique, quotas, pricing outcome |
| R6 | Churn si le ROI n'est pas prouvé rapidement | Élevé | Moyenne | 4 moments de vérité en 14j, dashboard CA récupéré |
| R7 | Conjoncture bâtiment dégradée | Moyen | Moyenne | Focus dépannage/urgence (contracyclique) |
| R8 | Dépendance à un fournisseur (téléphonie/IA) | Moyen | Faible | Redondance, abstraction des fournisseurs |
| R9 | Conformité RGPD / enregistrement mal cadrés | Élevé | Faible | Conformité by design, hébergement UE, consentement |
| R10 | Sur-extension prématurée (trop de métiers/géos) | Élevé | Moyenne | Discipline : un métier, une géo, puis élargir |
| R11 | Erreur de l'agent (mauvais RDV, mauvais prix) | Moyen | Moyenne | Garde-fous, validation devis, pas de prix ferme |
| R12 | Difficulté à lever / dilution excessive | Moyen | Moyenne | Lever après la preuve, maximiser la valo |
| R13 | Dépendance fondateur (bande passante) | Moyen | Moyenne | Recruter tôt un profil GTM/COO |

## 25.2 Les 3 risques qui tuent le projet

1. **L'adoption** (R1) — si l'artisan ne fait pas confiance, rien ne se passe.
2. **La qualité vocale** (R2) — une mauvaise voix détruit la confiance client final.
3. **Le churn** (R6) — sans ROI prouvé vite, la machine fuit.

Toute l'énergie des 90 premiers jours doit dérisquer ces trois points.

## 25.3 Plan de contingence

- Si l'adoption cale : renforcer le mode débordement et la preuve sociale (témoignages).
- Si la voix déçoit : itérer vite, éventuellement changer de fournisseur TTS.
- Si le churn monte : audit des comptes qui ne captent pas d'appels (souvent un problème de config renvoi).

---

# TOME 26 — ROADMAP DÉTAILLÉE

## 26.1 Les 90 premiers jours

1. **Semaines 1–2** — Verrouiller le scope MVP avec Etan ; rappeler Mathieu (back) et Sylvain (agents/prompts) ; choisir la brique voix FR.
2. **Semaines 3–8** — Build MVP : agent vocal (débordement + 24/7) + capture appels + prise de RDV + devis auto plomberie/chauffage.
3. **Semaines 6–8 (en parallèle)** — Recruter 10–20 design partners plombiers/chauffagistes en Île-de-France.
4. **Semaines 9–12** — Mise en production chez les design partners ; mesurer le CA récupéré ; capturer témoignages + 1 ambassadeur.
5. **Fin S90** — Dossier de preuve prêt → préparer le seed + ouvrir l'acquisition Phase 1.

## 26.2 Roadmap produit — 12 mois

- **T1** : MVP (vocal, RDV, devis, relance devis, multicanal appel/SMS/WhatsApp, dashboard CA récupéré).
- **T2** : chatbot web, rappel appels manqués, bibliothèque de prix affinée, analytics.
- **T3** : multi-techniciens (base), intégrations Google Agenda/GBP, self-service onboarding rodé.
- **T4** : préparation facturation + relance impayés (v2), premières intégrations CRM tiers.

## 26.3 Roadmap 4 ans (macro)

- **An 1** : dominer plomberie/chauffage en France ; ~1 000 clients ; ~2 M€ ARR.
- **An 2** : métiers adjacents + modules (facturation, impayés) ; ~7 000 clients ; ~16 M€ ARR.
- **An 3** : expansion francophone (BE/CH/LU) ; ~20 000 clients ; ~48 M€ ARR.
- **An 4** : Europe + verticales-sœurs ; ~40 000 clients ; ~100 M€ ARR.

## 26.4 Jalons de dérisquage

- **Jalon 1** : 10 design partners live, CA récupéré prouvé.
- **Jalon 2** : 100 clients payants, churn maîtrisé.
- **Jalon 3** : machine d'acquisition rentable (CAC payback < 12 mois).
- **Jalon 4** : premier marché francophone hors France ouvert.
- **Jalon 5** : première verticale-sœur validée.

---

# TOME 27 — ÉQUIPE, RECRUTEMENT & ORGANISATION

## 27.1 Équipe actuelle & rôles

- **Fondateur** : vision produit, prompts, stratégie commerciale, décisions d'architecture.
- **Etan** : frontend / développement, intégration.
- **Mathieu** (à rappeler) : backend.
- **Sylvain** (à rappeler) : agents IA / prompts — idéal pour la logique conversationnelle vocale.

## 27.2 Le build de la brique vocale

- La brique neuve (vocal) est le cœur. Responsable : Sylvain + éventuellement un **freelance voice-AI** pour accélérer.
- Etan : intégration frontend + dashboard + onboarding.
- Mathieu : backend, données, API.

## 27.3 Premiers recrutements prioritaires

1. **Un profil GTM / growth** (le plus tôt possible) — pour ne pas faire reposer l'acquisition sur le seul fondateur.
2. **Un customer success / onboarding** — pour l'activation et la rétention.
3. **Un ingénieur voice-AI** — pour internaliser et améliorer le cœur.

## 27.4 Organisation cible (à 12–18 mois)

- **Produit & Tech** : lead technique + ingénieurs (vocal, backend, frontend).
- **Growth & Sales** : acquisition, démos, closing.
- **Customer Success** : onboarding, rétention, support.
- **Ops** : conformité, finance, partenariats.

## 27.5 Culture

- Obsession client final (qualité de l'appel).
- Vitesse d'exécution.
- Preuve avant promesse.
- Discipline de focus (un métier, une géo).

## 27.6 Rôle du fondateur dans le temps

- **Aujourd'hui** : tout (produit, vente, vision).
- **Demain** : CEO produit + vision, entouré d'un profil GTM/COO et d'un lead technique. Déléguer l'acquisition et l'ops pour se concentrer sur produit et stratégie.

---
---

# TOME 28 — PROMPTS & BRIEF DÉVELOPPEUR POUR ETAN

## 28.1 Objectif du tome

Ce tome traduit la Bible en instructions actionnables pour le développement. Il précise ce qu'Etan (et l'équipe) doit construire, dans quel ordre, et avec quels garde-fous.

## 28.2 Périmètre du MVP (rappel)

**À construire (Must have) :**

1. Agent vocal FR (débordement + 24/7) via Twilio + STT/TTS.
2. Capture d'appels manqués / mode débordement.
3. Qualification de l'appel (nature, urgence, zone, coordonnées).
4. Prise de RDV avec vérification d'agenda temps réel.
5. Génération de devis pré-rempli (template plomberie/chauffage, TVA auto).
6. Relance des devis (J+1 / J+3 / J+7, multicanal).
7. Multicanal Appel + SMS + WhatsApp + inbox unifiée.
8. Dashboard artisan avec « CA récupéré » en évidence.
9. Onboarding wizard (live en 48h).

**Réutilisé de l'existant (~80 %) :** qualification, CRM/mini-agenda, moteur de relance, multicanal, chatbot.

**Brique neuve (cœur) :** l'agent vocal + la capture d'appels + le pipeline STT/TTS.

## 28.3 Prompt système de l'agent vocal (base)

> À affiner par Sylvain. Trame de départ :

```
Tu es l'assistant téléphonique de {NOM_ENTREPRISE}, une entreprise de
plomberie et chauffage. Tu réponds aux appels des clients à la place de
l'artisan, qui est en intervention.

TON RÔLE :
- Accueillir chaleureusement et professionnellement.
- Comprendre le problème (fuite, panne chaudière, pas d'eau chaude...).
- Évaluer l'urgence (immédiat / aujourd'hui / cette semaine / programmé).
- Vérifier que le client est dans la zone d'intervention ({ZONES}).
- Proposer DEUX créneaux concrets disponibles dans l'agenda.
- Confirmer le rendez-vous et récapituler.
- Donner une fourchette de prix indicative (jamais un prix ferme).
- Collecter nom, téléphone, adresse.
- Annoncer l'envoi d'un SMS de confirmation.

RÈGLES ABSOLUES :
- Ne JAMAIS donner de prix ferme, seulement une fourchette.
- Ne JAMAIS promettre un délai non vérifié dans l'agenda.
- En cas d'urgence vitale (gaz, danger), donner les consignes de sécurité
  et transférer immédiatement / orienter vers le numéro d'urgence.
- Si le client est mécontent ou insiste pour un humain, transférer.
- Se présenter comme assistant virtuel si on te le demande.
- Toujours reformuler le problème pour montrer que tu as compris.
- Toujours proposer deux créneaux concrets, pas une question ouverte.

TON : chaleureux, rassurant, efficace, professionnel. Français naturel.
```

## 28.4 Prompt de qualification (extraction structurée)

```
À partir de la transcription de l'appel, extrais en JSON :
{
  "nature_probleme": "...",
  "urgence": "immediat | jour | semaine | programme",
  "code_postal": "...",
  "dans_zone": true/false,
  "nom_client": "...",
  "telephone": "...",
  "adresse": "...",
  "creneau_souhaite": "...",
  "ca_estime": nombre,
  "resultat": "rdv_pris | qualifie | transfere | hors_perimetre | perdu"
}
Ne renvoie QUE le JSON, sans texte autour.
```

## 28.5 Prompt de génération de devis

```
À partir des informations de l'intervention et de la bibliothèque de prix
de l'entreprise, génère un devis en JSON :
{
  "lignes": [{ "designation": "...", "quantite": n, "prix_unitaire_ht": n }],
  "montant_ht": n,
  "taux_tva": 10 | 20 | 5.5,
  "montant_ttc": n
}
Applique le bon taux de TVA selon la nature des travaux (règles TVA bâtiment).
Ne renvoie QUE le JSON.
```

## 28.6 Ordre de construction recommandé

1. **Pipeline vocal minimal** : Twilio → STT → Claude → TTS → réponse. Objectif : un agent qui décroche et tient une conversation.
2. **Capture + journalisation** : chaque appel crée une entrée `appels` avec transcript et résultat.
3. **Qualification structurée** : extraction JSON des infos.
4. **Agenda + prise de RDV** : vérification dispo + création `rendez_vous` + confirmation SMS.
5. **Devis auto** : génération + validation artisan + envoi.
6. **Relances** : file de jobs J+1/J+3/J+7.
7. **Dashboard** : CA récupéré, appels, RDV, devis.
8. **Onboarding wizard** : config + renvoi + test.

## 28.7 Points d'attention technique

- **Latence** : viser < 1,5 s de réponse perçue. Streaming STT et TTS.
- **Barge-in** : couper le TTS dès que le client parle.
- **Robustesse** : jamais de silence total (fallback + rappel).
- **Cloisonnement** : données strictement isolées par entreprise.
- **UE** : toutes les données en région européenne.

## 28.8 Ce qui manque encore (à produire par l'équipe)

- Schéma SQL final validé (base : Tome 13).
- Wireframes du dashboard et de l'onboarding.
- Spécification détaillée du pipeline vocal (fournisseurs STT/TTS FR retenus).
- Diagramme d'états de l'agent conversationnel.
- Configuration de la file de jobs (relances, rappels).
- Flux OAuth / auth artisan.
- Bibliothèque de prix plomberie/chauffage initiale.

---

# ANNEXES

## Annexe A — Checklist de lancement (90 jours)

- [ ] Scope MVP verrouillé avec l'équipe.
- [ ] Mathieu et Sylvain rappelés / brique vocale attribuée.
- [ ] Fournisseur STT/TTS FR choisi et testé.
- [ ] Pipeline vocal minimal fonctionnel.
- [ ] Capture + qualification opérationnelles.
- [ ] Agenda + prise de RDV opérationnels.
- [ ] Devis auto opérationnel (template + TVA).
- [ ] Relances opérationnelles.
- [ ] Dashboard CA récupéré en place.
- [ ] Onboarding wizard testé (live en 48h).
- [ ] 10–20 design partners recrutés (Île-de-France).
- [ ] Mise en production chez les design partners.
- [ ] CA récupéré mesuré et documenté.
- [ ] Témoignages + 1 ambassadeur capturés.
- [ ] Dossier de preuve pour le seed prêt.

## Annexe B — Décisions verrouillées (récapitulatif)

1. Secteur : dépannage à domicile (Monde B), pas le chantier.
2. Métier de lancement : plomberie/chauffage. 🔴 à confirmer
3. Cible : 40 000 clients × ~2 500 €/an = 100 M€ ARR en 4 ans.
4. Wedge : l'agent vocal qui récupère les appels manqués.
5. Modèle : abonnement + outcome, zéro commission sur le CA.
6. Pricing : Solo 149 € / Pro 349 € / PME 599 €.
7. Essai : 14 jours, sans CB.
8. Mode de lancement : débordement + hors-horaires.
9. Devis-only au lancement ; facturation en v2.
10. Géo : France → francophone → Europe. Pas les US.
11. Marque : Balia (mère), déclinaison dépannage.
12. Financement : MVP + design partners autofinancés, puis seed après preuve. 🔴 timing à confirmer.

## Annexe C — Questions ouvertes à trancher au fil de l'eau

- 🟡 Fourchette exacte de prix par intervention (à calibrer avec les design partners).
- 🟡 Fournisseur STT/TTS FR définitif.
- 🟡 Cadence de relance optimale (à tester).
- 🟡 Seuil de bascule débordement → standard complet.
- 🔴 Timing de la levée de fonds.
- 🔴 Confirmation métier de lancement (plomberie/chauffage vs autre).

## Annexe D — Lexique des métiers du Monde B (cibles d'expansion)

- Plomberie / Chauffage (CVC) — **lancement**.
- Électricité — expansion phase 2.
- Serrurerie — expansion phase 2.
- Vitrerie — expansion phase 2.
- Débouchage / assainissement — expansion phase 2.
- Dépannage multi-services — phase 2/3.

## Annexe E — Verticales-sœurs (même moteur, expansion future)

- Santé de proximité (médecins, dentistes, kinés, vétos) — secrétariat médical IA.
- Automobile après-vente (garages, concessions) — prise de RDV atelier.
- Courtage (assurance, crédit) — qualification et relance de dossiers.

---

**FIN DE LA BIBLE — v1.0**

*Document vivant. Toute décision majeure modifiée crée une nouvelle version. Prochaine étape suggérée : produire les wireframes, la spec détaillée du pipeline vocal, et le repositionnement du PRD Balia sur cette base.*
