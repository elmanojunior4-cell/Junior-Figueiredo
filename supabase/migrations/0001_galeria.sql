-- Estúdio JF — módulo Galeria + seleção + extras
-- Rode no SQL Editor do Supabase (ou com `supabase db push`).
-- Todo acesso passa pelo servidor com a service role; RLS ligado e sem políticas públicas.

create extension if not exists "pgcrypto";

-- Casais (base do futuro CRM)
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  names text not null,                 -- "Ana & Pedro"
  email text,
  phone text,                          -- WhatsApp com DDD
  wedding_date date,
  city text,
  notes text,
  created_at timestamptz not null default now()
);

do $$ begin
  create type gallery_status as enum ('draft','published','selecting','selection_done','delivered');
exception when duplicate_object then null; end $$;

create table if not exists galleries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete set null,
  slug text not null unique,
  title text not null,
  event_date date,
  password_hash text not null,
  status gallery_status not null default 'draft',
  package_limit int not null default 0,          -- fotos do álbum incluídas no pacote (0 = sem limite)
  extra_price_cents int not null default 0,      -- preço por foto extra
  extra_tiers jsonb not null default '[]'::jsonb, -- [{"qty":10,"price_cents":15000}]
  selection_deadline date,
  allow_download boolean not null default true,
  cover_photo_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references galleries(id) on delete cascade,
  name text not null,                  -- Pré-wedding, Making of, Cerimônia, Recepção
  position int not null default 0
);
create index if not exists sections_gallery_idx on sections(gallery_id, position);

create table if not exists photos (
  id uuid primary key,
  gallery_id uuid not null references galleries(id) on delete cascade,
  section_id uuid references sections(id) on delete set null,
  number int not null,                 -- número visível para o casal (1, 2, 3...)
  filename text not null,              -- nome original, usado no Lightroom
  width int not null,
  height int not null,
  size_bytes bigint not null default 0,
  key_full text not null,
  key_web text not null,
  key_thumb text not null,
  created_at timestamptz not null default now(),
  unique (gallery_id, number)
);
create index if not exists photos_gallery_idx on photos(gallery_id, number);

create table if not exists selections (
  gallery_id uuid not null references galleries(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (gallery_id, photo_id)
);

do $$ begin
  create type order_status as enum ('pending','paid','cancelled');
exception when duplicate_object then null; end $$;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references galleries(id) on delete cascade,
  selected_count int not null,
  extra_count int not null,
  amount_cents int not null,
  status order_status not null default 'pending',
  mp_preference_id text,
  mp_payment_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists orders_gallery_idx on orders(gallery_id, created_at desc);

-- Linha do tempo de cada galeria (vai alimentar o CRM e os avisos de WhatsApp)
create table if not exists gallery_events (
  id bigint generated always as identity primary key,
  gallery_id uuid not null references galleries(id) on delete cascade,
  type text not null,                  -- published, first_selection, selection_done, order_created, order_paid
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists events_gallery_idx on gallery_events(gallery_id, created_at desc);

alter table clients enable row level security;
alter table galleries enable row level security;
alter table sections enable row level security;
alter table photos enable row level security;
alter table selections enable row level security;
alter table orders enable row level security;
alter table gallery_events enable row level security;
