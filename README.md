# Balia

**Le système d'exploitation IA de l'immobilier** — France, Belgique, Suisse, Luxembourg.

Balia ne se contente pas d'assister : il **fait le travail** (qualification de leads, rédaction d'annonces, préparation de la diffusion), et l'humain **valide d'un geste** via la carte de résultat. Ce dépôt contient le socle MVP décrit dans la Bible produit (Tome 14).

## Ce que fait ce MVP

- **Agent Leads + qualification + RDV** — un contact entrant est scoré, résumé, et reçoit une proposition de réponse + créneaux de rendez-vous.
- **Agent Génération d'annonces** — une saisie du bien produit une annonce optimisée, avec multidiffusion préparée (SeLoger, LeBonCoin, BienIci).
- **Carte de résultat** — l'unité de base de l'interface : tout ce que Balia produit revient sous forme de carte à valider, éditer ou rejeter.
- **Human-in-the-loop** — aucun acte sortant (email, SMS, publication) n'est exécuté sans validation humaine (garde-fou Tome 11).
- **Journal d'audit** — chaque événement est tracé (`GET /api/audit`), sans aucune PII.

## Démarrage

```bash
npm install
cp .env.example .env.local   # optionnel — voir "modes" ci-dessous
npm run dev                  # http://localhost:3000
```

### Modes de fonctionnement

Le produit démarre **sans aucune clé** (règle d'onboarding, Tome 12 : valeur dès la première session, accès minimal au départ) :

| Variable absente | Comportement |
|---|---|
| `ANTHROPIC_API_KEY` | Agents en mode démo : sorties simulées déterministes |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Store en mémoire (perdu au redémarrage — dev/démo uniquement) |
| `TWILIO_*` | Envois sortants simulés et journalisés, jamais envoyés |

Avec `ANTHROPIC_API_KEY`, les agents utilisent l'API Claude : `claude-sonnet-5` pour le volume, `claude-opus-4-8` pour le raisonnement complexe (configurable via `BALIA_MODEL_VOLUME` / `BALIA_MODEL_COMPLEX`).

### Supabase

Appliquer `supabase/migrations/0001_init.sql` sur votre projet (RLS activé sur toutes les tables), puis renseigner `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`. Hébergement UE recommandé (garde-fou RGPD).

## Structure

```
/app          pages (landing, /dashboard) et routes API
/components   UI, dont ResultCardView (la carte de résultat)
/agents       agents IA : leadQualification, announcement
/lib          claude, store (supabase/mémoire), cards, outbound, audit, config
/types        types métier
/tests        tests unitaires (vitest)
/supabase     migrations SQL
```

## Commandes

```bash
npm run dev        # serveur de développement
npm run build      # build production
npm run typecheck  # TypeScript strict
npm test           # tests unitaires
```

## Garde-fous intégrés (Tome 11)

- **Validation humaine obligatoire** pour tout acte sortant — machine à états `draft → validated | rejected`, aucun envoi hors état `validated`.
- **Pas de PII dans les logs** ni dans le journal d'audit (ids et événements uniquement).
- **Secrets en variables d'environnement** uniquement.
- **RLS Supabase** activé sur toutes les tables.

## Prochaines étapes (roadmap Tome 14)

- Connecteurs portails réels (multidiffusion), boîte mail entrante, WhatsApp.
- V1 : estimation & analyse de marché, CRM & rapprochement, reporting vendeur.
- Auth multi-structure (organisations, rôles, permissions filtrées).
