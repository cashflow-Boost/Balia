-- ─────────────────────────────────────────────────────────────
-- Balia — Row Level Security (cloisonnement par entreprise)
-- Base : BIBLE Tome 12.4 « données strictement isolées par entreprise ».
--
-- Principe : chaque utilisateur authentifié (auth.uid()) est rattaché à une
-- entreprise via la table `utilisateurs`. On n'accède qu'aux lignes de SON
-- entreprise. La clé service_role (serveur : webhooks vocaux, jobs) bypass
-- la RLS et n'est jamais exposée au client.
-- ─────────────────────────────────────────────────────────────

-- Helper : l'entreprise de l'utilisateur courant -----------------
create or replace function current_entreprise_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select entreprise_id
  from utilisateurs
  where id = auth.uid()
  limit 1
$$;

-- Active la RLS partout ------------------------------------------
alter table entreprises     enable row level security;
alter table utilisateurs    enable row level security;
alter table appels          enable row level security;
alter table clients_finaux  enable row level security;
alter table rendez_vous     enable row level security;
alter table devis           enable row level security;
alter table relances        enable row level security;
alter table messages        enable row level security;
alter table abonnements     enable row level security;

-- Entreprises : on ne voit / modifie que la sienne ---------------
create policy "entreprise_isolee" on entreprises
  for all using (id = current_entreprise_id())
  with check (id = current_entreprise_id());

-- Utilisateurs : ceux de sa propre entreprise --------------------
create policy "utilisateurs_isoles" on utilisateurs
  for all using (entreprise_id = current_entreprise_id())
  with check (entreprise_id = current_entreprise_id());

-- Tables métier : filtrées par entreprise_id ---------------------
create policy "appels_isoles" on appels
  for all using (entreprise_id = current_entreprise_id())
  with check (entreprise_id = current_entreprise_id());

create policy "clients_isoles" on clients_finaux
  for all using (entreprise_id = current_entreprise_id())
  with check (entreprise_id = current_entreprise_id());

create policy "rdv_isoles" on rendez_vous
  for all using (entreprise_id = current_entreprise_id())
  with check (entreprise_id = current_entreprise_id());

create policy "devis_isoles" on devis
  for all using (entreprise_id = current_entreprise_id())
  with check (entreprise_id = current_entreprise_id());

create policy "messages_isoles" on messages
  for all using (entreprise_id = current_entreprise_id())
  with check (entreprise_id = current_entreprise_id());

create policy "abonnements_isoles" on abonnements
  for all using (entreprise_id = current_entreprise_id())
  with check (entreprise_id = current_entreprise_id());

-- Relances : rattachées via le devis parent ----------------------
create policy "relances_isolees" on relances
  for all using (
    exists (
      select 1 from devis d
      where d.id = relances.devis_id
        and d.entreprise_id = current_entreprise_id()
    )
  )
  with check (
    exists (
      select 1 from devis d
      where d.id = relances.devis_id
        and d.entreprise_id = current_entreprise_id()
    )
  );
