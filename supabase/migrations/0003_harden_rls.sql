-- ─────────────────────────────────────────────────────────────
-- Balia — Durcissement RLS (advisors 0028/0029)
-- Le helper current_entreprise_id() était dans le schéma `public`, donc
-- exposé comme endpoint RPC (/rest/v1/rpc/...). On le déplace dans un schéma
-- `private` non exposé par l'API. Il reste SECURITY DEFINER (indispensable :
-- il lit `utilisateurs` en contournant sa propre RLS) et reste utilisable
-- dans les policies via une référence SQL directe.
-- ─────────────────────────────────────────────────────────────

create schema if not exists private;

create or replace function private.current_entreprise_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select entreprise_id from utilisateurs where id = auth.uid() limit 1
$$;

-- Repointage des policies vers private.current_entreprise_id() ---------
drop policy if exists "entreprise_isolee" on entreprises;
create policy "entreprise_isolee" on entreprises
  for all using (id = private.current_entreprise_id())
  with check (id = private.current_entreprise_id());

drop policy if exists "utilisateurs_isoles" on utilisateurs;
create policy "utilisateurs_isoles" on utilisateurs
  for all using (entreprise_id = private.current_entreprise_id())
  with check (entreprise_id = private.current_entreprise_id());

drop policy if exists "appels_isoles" on appels;
create policy "appels_isoles" on appels
  for all using (entreprise_id = private.current_entreprise_id())
  with check (entreprise_id = private.current_entreprise_id());

drop policy if exists "clients_isoles" on clients_finaux;
create policy "clients_isoles" on clients_finaux
  for all using (entreprise_id = private.current_entreprise_id())
  with check (entreprise_id = private.current_entreprise_id());

drop policy if exists "rdv_isoles" on rendez_vous;
create policy "rdv_isoles" on rendez_vous
  for all using (entreprise_id = private.current_entreprise_id())
  with check (entreprise_id = private.current_entreprise_id());

drop policy if exists "devis_isoles" on devis;
create policy "devis_isoles" on devis
  for all using (entreprise_id = private.current_entreprise_id())
  with check (entreprise_id = private.current_entreprise_id());

drop policy if exists "messages_isoles" on messages;
create policy "messages_isoles" on messages
  for all using (entreprise_id = private.current_entreprise_id())
  with check (entreprise_id = private.current_entreprise_id());

drop policy if exists "abonnements_isoles" on abonnements;
create policy "abonnements_isoles" on abonnements
  for all using (entreprise_id = private.current_entreprise_id())
  with check (entreprise_id = private.current_entreprise_id());

drop policy if exists "relances_isolees" on relances;
create policy "relances_isolees" on relances
  for all using (
    exists (select 1 from devis d where d.id = relances.devis_id and d.entreprise_id = private.current_entreprise_id())
  )
  with check (
    exists (select 1 from devis d where d.id = relances.devis_id and d.entreprise_id = private.current_entreprise_id())
  );

-- Suppression de l'ancien helper exposé -------------------------------
drop function if exists public.current_entreprise_id();
