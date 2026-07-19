# Balia

**Le système d'exploitation IA de l'immobilier** (France, Belgique, Suisse, Luxembourg) — un cerveau qui fait le travail répétitif à la place des professionnels de l'immobilier ; l'humain valide et décide.

Positionnement : **Consolidation + Agentique + Alignement au résultat**.

## Documents

- [`docs/brief-maitre-v2.md`](docs/brief-maitre-v2.md) — le brief maître v2 : vision, cibles, pricing, roadmap, garde-fous.
- [`docs/specs/agent-leads-mvp.md`](docs/specs/agent-leads-mvp.md) — spec de bout en bout du premier agent du MVP : lead entrant → qualification → RDV → validation.
- [`CLAUDE.md`](CLAUDE.md) — contexte, conventions et garde-fous pour les sessions Claude Code.

## L'application (MVP)

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 31 tests (vitest)
npm run typecheck
```

- **Tableau de bord** (`/`) — la file de validation (cartes de résultat : ✅ valider · ✏️ ajuster · ❌ rejeter) + le pipeline de leads avec score et raisons.
- **Nouvelle annonce** (`/annonces`) — décrivez le bien, Balia rédige, le brouillon part en validation.
- **Webhook leads** (`POST /api/webhooks/leads`) — point d'entrée des contacts (portails, site).
- Sans `ANTHROPIC_API_KEY`, la génération bascule en mode démonstration ; avec la clé, Claude (Sonnet) rédige et qualifie.

Structure :

```
/app            pages et routes API (Next.js)
/components     UI réutilisable (dont la « carte de résultat »)
/agents         micro-agents (leads : machine à états, scoring, qualification · annonces)
/lib            clients et garde-fous (claude, messaging human-in-the-loop, store)
/types          types partagés
/tests          tests
```

## Stack cible

Claude API (Sonnet/Opus) · Supabase (RLS, hébergement UE) · Vercel · Twilio · DocuSign · Stripe · TypeScript/React (Next.js).

## Garde-fous non négociables

RGPD (données confiées, consentement, audit log, zéro PII dans les logs) · Human-in-the-loop sur tout acte sortant · Loi Hoguet (frais de succès forfaitaire, jamais un % du prix de vente). Détail dans `CLAUDE.md` §5.
