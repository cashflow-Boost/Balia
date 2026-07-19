# Balia

**Le système d'exploitation IA de l'immobilier** (France, Belgique, Suisse, Luxembourg) — un cerveau qui fait le travail répétitif à la place des professionnels de l'immobilier ; l'humain valide et décide.

Positionnement : **Consolidation + Agentique + Alignement au résultat**.

## Documents

- [`docs/brief-maitre-v2.md`](docs/brief-maitre-v2.md) — le brief maître v2 : vision, cibles, pricing, roadmap, garde-fous.
- [`docs/specs/agent-leads-mvp.md`](docs/specs/agent-leads-mvp.md) — spec de bout en bout du premier agent du MVP : lead entrant → qualification → RDV → validation.
- [`CLAUDE.md`](CLAUDE.md) — contexte, conventions et garde-fous pour les sessions Claude Code.

## Stack cible

Claude API (Sonnet/Opus) · Supabase (RLS, hébergement UE) · Vercel · Twilio · DocuSign · Stripe · TypeScript/React (Next.js).

## Garde-fous non négociables

RGPD (données confiées, consentement, audit log, zéro PII dans les logs) · Human-in-the-loop sur tout acte sortant · Loi Hoguet (frais de succès forfaitaire, jamais un % du prix de vente). Détail dans `CLAUDE.md` §5.
