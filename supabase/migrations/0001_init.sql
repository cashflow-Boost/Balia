-- ─────────────────────────────────────────────────────────────
-- Balia — Migration initiale (schéma de données)
-- Base : BIBLE Tome 13. Cible : PostgreSQL / Supabase (région UE).
-- ─────────────────────────────────────────────────────────────

-- Extensions ----------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ───────────────────────────── entreprises (artisans clients) ──
create table if not exists entreprises (
    id uuid primary key default gen_random_uuid(),
    nom text not null,
    metier text not null,                 -- plomberie, chauffage, elec...
    telephone_principal text,
    numero_balia text,                    -- numéro de renvoi/agent
    email text,
    adresse text,
    zone_intervention jsonb,              -- codes postaux couverts
    horaires_ouverture jsonb,
    tarif_urgence jsonb,
    plan text default 'solo',             -- solo, pro, pme
    statut text default 'trial',          -- trial, actif, suspendu, churn
    date_creation timestamptz default now(),
    trial_fin timestamptz
);

-- ─────────────────────────────────────────────── utilisateurs ──
create table if not exists utilisateurs (
    id uuid primary key default gen_random_uuid(),
    entreprise_id uuid references entreprises(id) on delete cascade,
    nom text,
    email text unique,
    role text default 'artisan',          -- artisan, technicien, admin
    telephone text,
    date_creation timestamptz default now()
);

-- ───────────────────────────────────────────────────── appels ──
create table if not exists appels (
    id uuid primary key default gen_random_uuid(),
    entreprise_id uuid references entreprises(id) on delete cascade,
    numero_appelant text,
    date_appel timestamptz default now(),
    duree_secondes int,
    mode text,                            -- debordement, hors_horaire, complet
    resultat text,                        -- rdv_pris, qualifie, transfere, hors_perimetre, perdu
    urgence text,                         -- immediat, jour, semaine, programme
    transcript text,
    enregistrement_url text,
    ca_estime numeric,                    -- valeur estimée récupérée
    transfere boolean default false
);

-- ──────────────────────────────────────────────── clients_finaux ──
create table if not exists clients_finaux (
    id uuid primary key default gen_random_uuid(),
    entreprise_id uuid references entreprises(id) on delete cascade,
    nom text,
    telephone text,
    email text,
    adresse text,
    code_postal text,
    canal_prefere text,                   -- sms, whatsapp, email, appel
    date_creation timestamptz default now()
);

-- ────────────────────────────────────────────────── rendez_vous ──
create table if not exists rendez_vous (
    id uuid primary key default gen_random_uuid(),
    entreprise_id uuid references entreprises(id) on delete cascade,
    client_id uuid references clients_finaux(id),
    appel_id uuid references appels(id),
    technicien_id uuid references utilisateurs(id),
    date_debut timestamptz,
    date_fin timestamptz,
    type text,                            -- urgence, programme, entretien
    statut text default 'confirme',       -- confirme, annule, reporte, realise, no_show
    adresse text,
    description text,
    rappel_envoye boolean default false
);

-- ───────────────────────────────────────────────────────── devis ──
create table if not exists devis (
    id uuid primary key default gen_random_uuid(),
    entreprise_id uuid references entreprises(id) on delete cascade,
    client_id uuid references clients_finaux(id),
    rdv_id uuid references rendez_vous(id),
    numero text,
    lignes jsonb,                         -- prestations, quantités, prix
    montant_ht numeric,
    montant_ttc numeric,
    taux_tva numeric,
    statut text default 'brouillon',      -- brouillon, envoye, vu, signe, refuse, perdu
    date_creation timestamptz default now(),
    date_envoi timestamptz,
    date_signature timestamptz
);

-- ─────────────────────────────────────────────────────── relances ──
create table if not exists relances (
    id uuid primary key default gen_random_uuid(),
    devis_id uuid references devis(id) on delete cascade,
    numero_relance int,                   -- 1, 2, 3
    canal text,                           -- sms, whatsapp, email
    date_envoi timestamptz,
    resultat text                         -- envoye, repondu, signe, ignore
);

-- ──────────────────────────────────────────── messages (inbox) ──
create table if not exists messages (
    id uuid primary key default gen_random_uuid(),
    entreprise_id uuid references entreprises(id) on delete cascade,
    client_id uuid references clients_finaux(id),
    canal text,                           -- appel, sms, whatsapp, email, web
    direction text,                       -- entrant, sortant
    contenu text,
    date_message timestamptz default now(),
    traite_par text                       -- agent, humain
);

-- ──────────────────────────────────────────────────── abonnements ──
create table if not exists abonnements (
    id uuid primary key default gen_random_uuid(),
    entreprise_id uuid references entreprises(id) on delete cascade,
    plan text,                            -- solo, pro, pme
    prix_mensuel numeric,
    quota_appels int,
    appels_consommes int default 0,
    stripe_subscription_id text,
    statut text,                          -- actif, en_pause, annule
    date_debut timestamptz,
    date_renouvellement timestamptz
);

-- ─────────────────────────────────────────────────────── index ──
create index if not exists idx_appels_entreprise on appels(entreprise_id);
create index if not exists idx_appels_date on appels(date_appel);
create index if not exists idx_rdv_entreprise on rendez_vous(entreprise_id);
create index if not exists idx_rdv_date on rendez_vous(date_debut);
create index if not exists idx_devis_entreprise on devis(entreprise_id);
create index if not exists idx_clients_entreprise on clients_finaux(entreprise_id);
create index if not exists idx_messages_entreprise on messages(entreprise_id);
