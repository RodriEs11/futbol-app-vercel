-- =========================================================
-- FUTGO — Migración inicial
-- Esquema normalizado para gestión de partidos de fútbol
-- entre amigos: jugadores, partidos, equipos, estadísticas.
-- =========================================================

-- ---------- Extensiones ----------
create extension if not exists "pgcrypto";

-- ---------- Tipos enumerados ----------
create type public.user_role as enum ('admin', 'player');
create type public.player_position as enum ('portero', 'defensor', 'mediocampista', 'delantero');
create type public.preferred_foot as enum ('izquierda', 'derecha', 'ambas');
create type public.player_status as enum ('activo', 'inactivo', 'lesionado');
create type public.match_status as enum ('programado', 'suspendido', 'finalizado', 'cancelado');
create type public.rsvp_status as enum ('confirmado', 'no_puede', 'tal_vez', 'pendiente');
create type public.card_type as enum ('amarilla', 'roja');
create type public.surface_type as enum ('cesped_natural', 'cesped_sintetico', 'cemento', 'otra');

-- ---------- user_profiles ----------
-- Extiende auth.users (Supabase Auth) con datos propios de la app.
create table public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'player',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- players ----------
create table public.players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles (id) on delete set null,
  first_name text not null,
  last_name text not null,
  nickname text,
  avatar_url text,
  birth_date date,
  favorite_position public.player_position,
  preferred_foot public.preferred_foot,
  jersey_number smallint check (jersey_number between 0 and 99),
  height_cm smallint check (height_cm between 100 and 250),
  weight_kg smallint check (weight_kg between 30 and 200),
  joined_at date not null default current_date,
  status public.player_status not null default 'activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index players_status_idx on public.players (status);
create index players_user_id_idx on public.players (user_id);

-- ---------- venues (canchas) ----------
create table public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  latitude double precision,
  longitude double precision,
  cost_per_match numeric(10, 2),
  surface public.surface_type,
  contact_info text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- matches (partidos) ----------
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references public.venues (id) on delete set null,
  match_date date not null,
  match_time time not null,
  price numeric(10, 2),
  max_players smallint not null default 14,
  notes text,
  status public.match_status not null default 'programado',
  created_by uuid references public.user_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index matches_date_idx on public.matches (match_date desc);
create index matches_status_idx on public.matches (status);

-- ---------- teams (equipos por partido) ----------
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default now()
);

create index teams_match_id_idx on public.teams (match_id);

-- ---------- match_players (convocatoria + pertenencia a equipo) ----------
create table public.match_players (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete cascade,
  team_id uuid references public.teams (id) on delete set null,
  rsvp_status public.rsvp_status not null default 'pendiente',
  minutes_played smallint,
  is_mvp boolean not null default false,
  created_at timestamptz not null default now(),
  unique (match_id, player_id)
);

create index match_players_match_id_idx on public.match_players (match_id);
create index match_players_player_id_idx on public.match_players (player_id);

-- ---------- goals ----------
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete cascade,
  team_id uuid references public.teams (id) on delete set null,
  assisted_by_player_id uuid references public.players (id) on delete set null,
  minute smallint check (minute between 0 and 130),
  is_own_goal boolean not null default false,
  created_at timestamptz not null default now()
);

create index goals_match_id_idx on public.goals (match_id);
create index goals_player_id_idx on public.goals (player_id);

-- ---------- cards (tarjetas) ----------
create table public.cards (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete cascade,
  type public.card_type not null,
  minute smallint check (minute between 0 and 130),
  reason text,
  created_at timestamptz not null default now()
);

create index cards_match_id_idx on public.cards (match_id);
create index cards_player_id_idx on public.cards (player_id);

-- ---------- match_results (resultado agregado por partido) ----------
create table public.match_results (
  match_id uuid primary key references public.matches (id) on delete cascade,
  team_a_id uuid references public.teams (id) on delete set null,
  team_b_id uuid references public.teams (id) on delete set null,
  team_a_score smallint not null default 0,
  team_b_score smallint not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------- updated_at trigger genérico ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.user_profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.players
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.venues
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.matches
  for each row execute function public.set_updated_at();

-- =========================================================
-- Row Level Security
-- =========================================================
alter table public.user_profiles enable row level security;
alter table public.players enable row level security;
alter table public.venues enable row level security;
alter table public.matches enable row level security;
alter table public.teams enable row level security;
alter table public.match_players enable row level security;
alter table public.goals enable row level security;
alter table public.cards enable row level security;
alter table public.match_results enable row level security;

-- Helper: ¿el usuario autenticado es admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Lectura: cualquier usuario autenticado puede leer todo (grupo cerrado de amigos).
create policy "authenticated read profiles" on public.user_profiles for select to authenticated using (true);
create policy "authenticated read players" on public.players for select to authenticated using (true);
create policy "authenticated read venues" on public.venues for select to authenticated using (true);
create policy "authenticated read matches" on public.matches for select to authenticated using (true);
create policy "authenticated read teams" on public.teams for select to authenticated using (true);
create policy "authenticated read match_players" on public.match_players for select to authenticated using (true);
create policy "authenticated read goals" on public.goals for select to authenticated using (true);
create policy "authenticated read cards" on public.cards for select to authenticated using (true);
create policy "authenticated read match_results" on public.match_results for select to authenticated using (true);

-- Escritura: solo admins gestionan el catálogo principal.
create policy "admin write players" on public.players for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admin write venues" on public.venues for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admin write matches" on public.matches for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admin write teams" on public.teams for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admin write goals" on public.goals for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admin write cards" on public.cards for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admin write match_results" on public.match_results for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Un jugador puede editar su propio perfil de usuario.
create policy "self update profile" on public.user_profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Un jugador puede actualizar su propia convocatoria (RSVP); el admin gestiona el resto.
create policy "self update rsvp" on public.match_players for update to authenticated
  using (player_id in (select id from public.players where user_id = auth.uid()))
  with check (player_id in (select id from public.players where user_id = auth.uid()));
create policy "admin manage match_players" on public.match_players for insert to authenticated
  with check (public.is_admin());
create policy "admin delete match_players" on public.match_players for delete to authenticated
  using (public.is_admin());
