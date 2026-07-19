# Spec — Agent Leads MVP : lead entrant → qualification → RDV → validation

*Spec d'implémentation prête pour Etan. Périmètre : le premier agent du socle (brief §10, MVP). Statut : v1 à challenger, mais suffisante pour commencer à coder.*

---

## 1. Objectif et périmètre

**Ce que fait l'agent :** capter tout lead entrant, y répondre en minutes (24/7), le qualifier (budget / financement / motivation / projet), proposer et caler un RDV dans l'agenda du bon collaborateur, et présenter à l'humain une **carte de résultat** à valider.

**Ce qu'il ne fait PAS (hors périmètre MVP) :**
- Estimation / avis de valeur (V1).
- Rapprochement automatique avec le portefeuille de biens (V1).
- Appels vocaux sortants automatiques (la voix entrante est captée ; la voix sortante IA est différée).
- Relances marketing de masse.

**Métrique de succès du MVP :** temps médian entre l'arrivée du lead et le premier contact < 5 minutes, 24/7 ; taux de leads qualifiés avec RDV posé ; zéro message sortant non couvert par une validation (voir §6).

---

## 2. Le point de tension à trancher AVANT de coder — et la résolution proposée

Le brief promet deux choses en apparence contradictoires :

1. « Balia rappelle/écrit **en minutes, 24/7** » (§3.1 — c'est LA proposition de valeur n°1).
2. « Tout acte qui sort de la structure exige une **validation utilisateur avant exécution** » (garde-fou §5 / §11).

Un lead qui arrive à 23h40 ne peut pas attendre qu'un humain valide un SMS à 8h. **Résolution proposée : la validation à deux niveaux.**

- **Niveau 1 — Scénario pré-approuvé (validation en amont, une fois).** La structure valide, à la configuration, le **scénario de qualification** : les messages types, les questions posées, le ton, les canaux, les horaires. Tout message strictement généré depuis ce scénario (templates avec variables + questions du script) peut partir automatiquement, 24/7. C'est la structure qui a validé, pas message par message.
- **Niveau 2 — Validation unitaire (par message).** Tout ce qui sort du scénario — réponse libre composée par le LLM, question inattendue du prospect, négociation, réclamation — n'est **jamais envoyé automatiquement**. Balia **prépare** la réponse, la met en file de validation, et notifie le collaborateur. La nuit, Balia prépare ; il n'envoie pas (brief §5).

Concrètement : le LLM classifie chaque tour de conversation en `in_scenario` / `out_of_scenario`. En cas de doute → `out_of_scenario` (fail-closed). Le RDV confirmé, lui, part toujours via template pré-approuvé.

> ⚠️ Cette résolution touche le garde-fou §5 du CLAUDE.md. Elle doit être explicitement validée (fondateur + à terme avocat RGPD) avant la mise en prod. Le code doit être écrit pour que le mode « validation unitaire sur tout » soit un simple flag de configuration par structure (`autonomy_level: 'manual' | 'scenario'`), défaut `manual`.

---

## 3. Parcours de bout en bout (le fil nominal)

```
[1] CAPTURE          Lead arrive (portail / formulaire / email / SMS / WhatsApp / appel manqué)
      │              → création du Lead, dédoublonnage, consentement tracé
      ▼
[2] PREMIER CONTACT  < 5 min, 24/7, sur le canal d'origine (scénario pré-approuvé)
      │              → accusé de réception + première question de qualification
      ▼
[3] QUALIFICATION    Conversation multi-tours (LLM + script) : projet, budget,
      │              financement, délai, secteur, motivation
      │              → score et statut de qualification
      ▼
[4] PRISE DE RDV     Propose 2-3 créneaux depuis l'agenda du collaborateur assigné
      │              → confirme le créneau choisi (template), invitation calendrier
      ▼
[5] CARTE DE RÉSULTAT  Le collaborateur voit : fiche lead qualifiée + transcript +
      │                score + RDV proposé/confirmé + prochaines actions
      ▼
[6] VALIDATION       Un geste : ✅ valider / ✏️ ajuster / ❌ rejeter (+ motif)
                     → le lead entre dans le pipeline, l'audit log est complet
```

Chemins non nominaux : voir §8 (edge cases).

---

## 4. Machine à états du Lead

```
NEW ──▶ CONTACTED ──▶ QUALIFYING ──▶ QUALIFIED ──▶ MEETING_PROPOSED ──▶ MEETING_CONFIRMED ──▶ HANDED_OFF
 │           │             │             │                  │                                     ▲
 │           │             │             └──▶ DISQUALIFIED  └──▶ MEETING_DECLINED ──┐             │
 │           │             └──▶ AWAITING_HUMAN (sortie de scénario) ────────────────┴──▶ (reprise humaine)
 │           └──▶ UNRESPONSIVE (après N relances espacées, N=2 par défaut)
 └──▶ DUPLICATE (fusionné avec un lead existant)
```

Règles :
- Toute transition est écrite dans `audit_log` (qui, quoi, quand, déclencheur).
- `AWAITING_HUMAN` est un état de sécurité : l'agent s'arrête, notifie, et n'envoie plus rien tant qu'un humain n'a pas repris ou validé.
- `DISQUALIFIED` reçoit toujours un message de clôture courtois (template) — jamais de silence.
- Relances (`UNRESPONSIVE`) : J+1 et J+3, templates pré-approuvés uniquement, jamais entre 21h et 8h heure locale du prospect.

---

## 5. Modèle de données (Supabase)

RLS activé sur **toutes** ces tables, scoping par `org_id` (la structure) puis par rôle.

```sql
-- Structures et utilisateurs : org, org_member (role: owner|manager|agent),
-- + table de config par org (scénario approuvé, autonomy_level, horaires, canaux actifs).

create table leads (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references orgs(id),
  assignee_id     uuid references org_members(id),      -- collaborateur assigné
  source          text not null,                        -- 'seloger'|'leboncoin'|'bienici'|'website'|'email'|'sms'|'whatsapp'|'missed_call'|'manual'
  source_ref      text,                                 -- id externe portail si dispo
  status          text not null default 'new',          -- machine à états §4
  first_name      text,
  last_name       text,
  email           text,
  phone           text,                                 -- E.164
  channel         text not null,                        -- canal de conversation principal
  consent_at      timestamptz,                          -- consentement au traitement (§9)
  consent_source  text,                                 -- d'où vient le consentement
  project         jsonb,                                -- {type: 'buy'|'sell'|'rent'|..., budget_min, budget_max, financing: 'cash'|'loan_approved'|'loan_pending'|'unknown', timeline, areas: [], notes}
  qualification   jsonb,                                -- {score: 0-100, tier: 'hot'|'warm'|'cold', reasons: []}
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table conversations (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references leads(id),
  org_id     uuid not null references orgs(id),
  channel    text not null,
  created_at timestamptz not null default now()
);

create table messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id),
  direction       text not null,                        -- 'inbound'|'outbound'
  body            text not null,
  sent_by         text not null,                        -- 'balia_scenario'|'balia_draft'|'human'
  approval_id     uuid references approvals(id),        -- si validation unitaire
  provider_ref    text,                                 -- SID Twilio etc.
  status          text not null,                        -- 'draft'|'pending_approval'|'sent'|'delivered'|'failed'
  created_at      timestamptz not null default now()
);

create table approvals (                                -- la file de validation (carte de résultat)
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references orgs(id),
  lead_id      uuid not null references leads(id),
  kind         text not null,                           -- 'message'|'meeting'|'qualification_summary'
  payload      jsonb not null,                          -- contenu proposé par Balia
  status       text not null default 'pending',         -- 'pending'|'approved'|'edited'|'rejected'|'expired'
  decided_by   uuid references org_members(id),
  decided_at   timestamptz,
  reject_reason text,
  created_at   timestamptz not null default now()
);

create table meetings (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references leads(id),
  org_id      uuid not null references orgs(id),
  member_id   uuid not null references org_members(id),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  kind        text not null,                            -- 'call'|'visit'|'office'|'video'
  status      text not null default 'proposed',         -- 'proposed'|'confirmed'|'declined'|'cancelled'|'done'
  calendar_ref text,                                    -- id événement Google/Microsoft
  created_at  timestamptz not null default now()
);

create table audit_log (
  id         bigint generated always as identity primary key,
  org_id     uuid not null,
  actor      text not null,                             -- 'balia'|'human:<member_id>'|'system'
  action     text not null,                             -- 'lead.created', 'message.sent', 'approval.approved'…
  entity     text not null,                             -- 'lead:<uuid>' etc. (ids techniques, JAMAIS de PII)
  metadata   jsonb,                                     -- sans PII (voir §9)
  created_at timestamptz not null default now()
);
```

---

## 6. Architecture d'exécution

```
/app/api/webhooks/twilio        ← SMS/WhatsApp/voix entrants (validation signature Twilio)
/app/api/webhooks/leads/[src]   ← portails & formulaire site (token par source)
/app/api/webhooks/email         ← parsing email entrant (provider type Resend/SendGrid inbound)
        │
        ▼
/agents/leads/ingest.ts         ← normalisation, dédoublonnage (phone/email), création Lead,
        │                          trace du consentement, assignation (round-robin ou règle org)
        ▼
/agents/leads/orchestrator.ts   ← cœur : lit l'état du lead + le scénario org, décide de
        │                          l'action suivante. UNE fonction pure decideNextAction(state)
        │                          → testable sans I/O.
        ├──▶ /agents/leads/qualify.ts    ← appel Claude (Sonnet) : extraction structurée
        │                                   {projet, budget, financement, délai} + classification
        │                                   in_scenario / out_of_scenario + score
        ├──▶ /agents/leads/scheduler.ts  ← lecture agenda (Google/Microsoft), proposition de
        │                                   créneaux, création événement à la confirmation
        └──▶ /lib/messaging.ts           ← envoi via Twilio/email. REFUSE tout envoi dont le
                                            message n'est ni 'balia_scenario' ni approuvé.
                                            C'est ICI que le garde-fou est appliqué (défense
                                            en profondeur, pas seulement dans l'orchestrateur).
```

Points d'implémentation :
- **Le garde-fou human-in-the-loop est dans la couche d'envoi**, pas seulement dans la logique amont : `sendMessage()` vérifie `sent_by === 'balia_scenario'` (et que le template correspond au scénario approuvé, par hash) **ou** `approval.status === 'approved'`. Sinon exception. Aucun autre chemin d'envoi.
- **LLM :** Sonnet par défaut pour la qualification (volume, coût). Extraction en JSON structuré (tool use / output schema), jamais de parsing de texte libre. Timeout + retry + fallback : si l'appel Claude échoue, le lead passe en `AWAITING_HUMAN` avec notification — on ne laisse jamais un prospect sans réponse à cause d'une panne silencieuse.
- **Idempotence :** tous les webhooks sont idempotents (clé = `provider_ref`/`source_ref`). Twilio et les portails renvoient les événements en double.
- **Files :** au MVP, pas d'infra de queue dédiée — Supabase + cron Vercel (relances, expirations d'approvals) suffisent. À revoir si le volume l'exige.

---

## 7. La carte de résultat (le motif UI fondateur)

Composant `<ResultCard>` dans `/components` — c'est LE motif réutilisé par tous les agents suivants, le soigner.

**Contenu (cas lead qualifié) :**
- En-tête : nom du prospect, canal, source, ancienneté du lead (« il y a 12 min »).
- Corps : synthèse de qualification (projet, budget, financement, délai, secteur) + score/tier avec les **raisons** (jamais un score sec) + RDV proposé ou confirmé.
- Repli : transcript complet de la conversation.
- Actions (un geste) : **✅ Valider** · **✏️ Ajuster** (édite le message/RDV proposé puis envoie) · **❌ Rejeter** (motif obligatoire, sert à améliorer le scénario).

**Comportement :**
- Une approbation `pending` non traitée escalade : rappel au collaborateur à +30 min, au manager à +2h (configurable par org).
- L'action est optimiste côté UI mais confirmée serveur ; double-tap impossible (l'approval est verrouillée à la première décision).
- Surfaces : desktop (liste de cartes = file de travail) et mobile (notification push → carte plein écran). Même composant, même logique.

---

## 8. Edge cases (à couvrir dès le MVP)

| Cas | Comportement |
|---|---|
| Lead en double (même phone/email, < 90 j) | Fusion sur le lead existant, statut `DUPLICATE` pour le nouveau, notification à l'assigné. Pas de deuxième séquence de contact. |
| Le prospect demande un humain | Sortie immédiate de scénario → `AWAITING_HUMAN`, notification, plus aucun message auto. |
| Message hors scénario (question juridique, négo, réclamation) | Balia **prépare** une réponse en brouillon → file de validation. Rien ne part seul. |
| Opt-out (« STOP », désinscription) | Arrêt immédiat de tout envoi, flag permanent sur le contact, trace en audit. Obligatoire (RGPD/LCEN). |
| Aucune réponse | Relances J+1, J+3 (templates), puis `UNRESPONSIVE`. Jamais entre 21h et 8h. |
| Aucun créneau dispo dans l'agenda | Pas d'invention de créneau : carte « agenda plein » au collaborateur, le prospect reçoit un message d'attente (template). |
| Le prospect propose un autre créneau en langage libre | Parsing par le LLM ; si confiance haute et créneau libre → proposition de confirmation (template) ; sinon `AWAITING_HUMAN`. |
| Panne Twilio / Claude / calendrier | Retry avec backoff ; au-delà → `AWAITING_HUMAN` + alerte. Jamais d'échec silencieux. |
| Langue ≠ français | MVP : français uniquement ; détection d'une autre langue → `AWAITING_HUMAN`. (FR/BE/CH/LU : prévoir NL/DE/EN en V1.) |
| Mineur ou donnée manifestement sensible dans la conversation | Pas de stockage en `project`, passage en `AWAITING_HUMAN`. |

---

## 9. RGPD — traduction concrète dans ce périmètre

- **Base de traitement :** le prospect a initié le contact (mesures précontractuelles / intérêt légitime). Le premier message de Balia inclut : qui traite les données (la structure), le fait qu'un assistant automatisé participe à l'échange, et le moyen d'opt-out. Formulation exacte à valider juridiquement, mais le slot existe dans le template dès le MVP.
- **PII :** jamais dans les logs applicatifs, les URLs, les query strings, ni `audit_log.metadata`. Les entités y sont référencées par UUID uniquement. Les webhooks entrants sont les seuls points où la PII transite en clair — parsée puis stockée en base (UE) immédiatement.
- **Hébergement :** projet Supabase en région UE ; vérifier la région des fonctions Vercel ; Twilio configuré avec numéros/routing UE.
- **Droits :** prévoir dès le schéma la suppression/export par `lead_id` (droit à l'effacement : cascade leads → conversations → messages → meetings ; l'audit log garde les événements mais ne contient pas de PII, donc il reste).
- **Pas de scoring intrusif :** le score de qualification est un outil interne d'orchestration, toujours accompagné de ses raisons, jamais exposé au prospect.

---

## 10. Tests (logique métier non triviale → testée)

- `decideNextAction()` : table de vérité complète états × événements (le cœur, fonction pure).
- `sendMessage()` : refuse un message ni scénario ni approuvé ; refuse après opt-out ; refuse hors horaires pour les relances.
- Classification `in_scenario`/`out_of_scenario` : jeu de conversations de référence (fixtures), y compris les cas ambigus → doivent tomber en `out_of_scenario`.
- Dédoublonnage et idempotence des webhooks (événements en double).
- Extraction de qualification : fixtures de conversations réelles anonymisées → JSON attendu.
- RLS : tests d'isolation entre deux orgs (l'org A ne lit jamais un lead de l'org B).

---

## 11. Ce que ça débloque ensuite

Ce parcours pose les quatre fondations que tous les agents suivants réutilisent : la **carte de résultat + file d'approbation** (motif universel), la **couche messaging avec garde-fou intégré**, l'**audit log**, et le **scénario pré-approuvé par org** (le mécanisme d'autonomie supervisée qui s'étendra en V2). L'agent Annonces et la Multidiffusion (MVP, suite) se branchent sur exactement les mêmes briques.

**Questions ouvertes pour décision (ne bloquent pas le démarrage du code) :**
1. Validation du modèle « scénario pré-approuvé » (§2) par le fondateur, puis revue juridique.
2. Règle d'assignation des leads par défaut : round-robin, par secteur, ou « premier qui accepte » ?
3. Formulation exacte de la mention d'information RGPD dans le premier message.
4. Seuils du score hot/warm/cold — à calibrer avec les premières vraies conversations.
