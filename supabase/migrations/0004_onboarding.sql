-- ─────────────────────────────────────────────────────────────
-- Balia — Onboarding (BIBLE Tome 16)
-- RPC d'amorçage : un nouvel utilisateur authentifié n'a pas encore de ligne
-- `utilisateurs`, donc la RLS l'empêche de créer son entreprise. Cette fonction
-- SECURITY DEFINER crée l'entreprise ET le lien utilisateur (id = auth.uid())
-- de façon atomique. Callable uniquement par un utilisateur connecté.
-- ─────────────────────────────────────────────────────────────

create or replace function public.onboard_entreprise(
  p_nom text,
  p_metier text,
  p_telephone text,
  p_zone jsonb,
  p_horaires jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_ent uuid;
begin
  if v_uid is null then
    raise exception 'non authentifié';
  end if;

  -- Un seul onboarding par utilisateur (idempotence défensive).
  if exists (select 1 from utilisateurs where id = v_uid) then
    raise exception 'utilisateur déjà rattaché à une entreprise';
  end if;

  if coalesce(trim(p_nom), '') = '' or coalesce(trim(p_metier), '') = '' then
    raise exception 'nom et métier sont obligatoires';
  end if;

  insert into entreprises (nom, metier, telephone_principal, zone_intervention, horaires_ouverture)
    values (trim(p_nom), trim(p_metier), nullif(trim(p_telephone), ''), p_zone, p_horaires)
    returning id into v_ent;

  insert into utilisateurs (id, entreprise_id, email, role)
    values (
      v_uid,
      v_ent,
      (select email from auth.users where id = v_uid),
      'artisan'
    );

  return v_ent;
end;
$$;

-- Seuls les utilisateurs connectés peuvent s'onboarder (pas les anonymes).
revoke all on function public.onboard_entreprise(text, text, text, jsonb, jsonb) from public, anon;
grant execute on function public.onboard_entreprise(text, text, text, jsonb, jsonb) to authenticated;
