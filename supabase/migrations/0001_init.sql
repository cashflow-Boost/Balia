-- Schéma initial Balia — RLS activé sur toutes les tables (Bible, Tome 10/11).
-- Le backend utilise la clé service_role ; aucune policy publique n'est
-- ouverte par défaut : tout accès client direct est refusé tant qu'une
-- policy explicite n'est pas ajoutée.

create table if not exists leads (
  id uuid primary key,
  created_at timestamptz not null default now(),
  data jsonb not null
);

create table if not exists result_cards (
  id uuid primary key,
  created_at timestamptz not null default now(),
  status text not null check (status in ('draft', 'validated', 'rejected')),
  data jsonb not null
);

create table if not exists audit_log (
  id uuid primary key,
  at timestamptz not null default now(),
  event text not null,
  ref_id uuid not null,
  detail text
);

alter table leads enable row level security;
alter table result_cards enable row level security;
alter table audit_log enable row level security;

create index if not exists result_cards_created_at_idx on result_cards (created_at desc);
create index if not exists audit_log_at_idx on audit_log (at desc);
