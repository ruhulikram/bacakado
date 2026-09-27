-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New Query)

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table if not exists public.gifts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade,
  recipient_name text        not null,
  opening_text   text        not null default '',
  theme          text        not null default 'ulang-tahun',
  closing_text   text        not null default '',
  music_url      text,
  slug           text        unique not null,
  status         text        not null default 'draft'
                   check (status in ('draft', 'published')),
  is_public      boolean     not null default true,
  view_count     integer     not null default 0,
  like_count     integer     not null default 0,
  created_at     timestamptz not null default now(),
  published_at   timestamptz
);

create table if not exists public.cards (
  id           uuid primary key default gen_random_uuid(),
  gift_id      uuid references public.gifts(id) on delete cascade not null,
  order_index  integer     not null default 0,
  text_content text        not null default '',
  image_url    text,
  created_at   timestamptz not null default now()
);

create table if not exists public.replies (
  id           uuid primary key default gen_random_uuid(),
  gift_id      uuid references public.gifts(id) on delete cascade not null,
  sender_name  text        not null,
  message      text        not null,
  created_at   timestamptz not null default now()
);

create table if not exists public.gift_views (
  id        uuid primary key default gen_random_uuid(),
  gift_id   uuid references public.gifts(id) on delete cascade not null,
  opened_at timestamptz not null default now()
);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

alter table public.gifts      enable row level security;
alter table public.cards      enable row level security;
alter table public.replies    enable row level security;
alter table public.gift_views enable row level security;

-- Gifts
drop policy if exists "public can read published gifts" on public.gifts;
create policy "public can read published gifts"
  on public.gifts for select using (status = 'published');

drop policy if exists "owner can read own gifts" on public.gifts;
create policy "owner can read own gifts"
  on public.gifts for select using (auth.uid() = user_id);

drop policy if exists "owner can insert gifts" on public.gifts;
create policy "owner can insert gifts"
  on public.gifts for insert with check (auth.uid() = user_id);

drop policy if exists "owner can update gifts" on public.gifts;
create policy "owner can update gifts"
  on public.gifts for update using (auth.uid() = user_id);

drop policy if exists "owner can delete gifts" on public.gifts;
create policy "owner can delete gifts"
  on public.gifts for delete using (auth.uid() = user_id);

-- Cards
drop policy if exists "public can read cards of published gifts" on public.cards;
create policy "public can read cards of published gifts"
  on public.cards for select using (
    exists (
      select 1 from public.gifts
      where gifts.id = cards.gift_id and gifts.status = 'published'
    )
  );

drop policy if exists "owner can manage cards" on public.cards;
create policy "owner can manage cards"
  on public.cards for all using (
    exists (
      select 1 from public.gifts
      where gifts.id = cards.gift_id and gifts.user_id = auth.uid()
    )
  );

-- Replies
drop policy if exists "anyone can reply to published gifts" on public.replies;
create policy "anyone can reply to published gifts"
  on public.replies for insert with check (
    exists (
      select 1 from public.gifts
      where gifts.id = replies.gift_id and gifts.status = 'published'
    )
  );

drop policy if exists "owner can read replies" on public.replies;
create policy "owner can read replies"
  on public.replies for select using (
    exists (
      select 1 from public.gifts
      where gifts.id = replies.gift_id and gifts.user_id = auth.uid()
    )
  );

-- Gift views
drop policy if exists "anyone can record a view" on public.gift_views;
create policy "anyone can record a view"
  on public.gift_views for insert with check (true);

drop policy if exists "owner can read views" on public.gift_views;
create policy "owner can read views"
  on public.gift_views for select using (
    exists (
      select 1 from public.gifts
      where gifts.id = gift_views.gift_id and gifts.user_id = auth.uid()
    )
  );

-- ─── Helper function ──────────────────────────────────────────────────────────

create or replace function increment_view_count(p_gift_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.gifts set view_count = view_count + 1 where id = p_gift_id;
end;
$$;

-- ─── Storage Bucket ──────────────────────────────────────────────────────────

-- Create public bucket for gift images (if not exists)
insert into storage.buckets (id, name, public)
values ('gift-images', 'gift-images', true)
on conflict (id) do nothing;

-- Allow public access to view images
drop policy if exists "public can view gift images" on storage.objects;
create policy "public can view gift images"
  on storage.objects for select
  using (bucket_id = 'gift-images');

-- Allow anyone to upload images for gift cards
drop policy if exists "anyone can upload gift images" on storage.objects;
create policy "anyone can upload gift images"
  on storage.objects for insert
  with check (bucket_id = 'gift-images');

-- ─── Migration: Premium Gifts & Mayar Payments ──────────────────────────────

alter table public.gifts
  add column if not exists is_premium boolean not null default false,
  add column if not exists passcode text;

create table if not exists public.payments (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade not null,
  gift_id          uuid references public.gifts(id) on delete cascade not null,
  mayar_invoice_id text,
  payment_url      text,
  amount           numeric not null default 5000,
  status           text not null default 'pending'
                     check (status in ('pending', 'paid', 'failed', 'expired')),
  created_at       timestamptz not null default now(),
  paid_at          timestamptz
);

alter table public.payments enable row level security;

drop policy if exists "owner can read own payments" on public.payments;
create policy "owner can read own payments"
  on public.payments for select using (auth.uid() = user_id);

drop policy if exists "owner can insert own payments" on public.payments;
create policy "owner can insert own payments"
  on public.payments for insert with check (auth.uid() = user_id);

drop policy if exists "service role can update payments" on public.payments;
create policy "service role can update payments"
  on public.payments for update using (true);

-- Function to securely mark a gift and payment as paid (callable by webhook)
create or replace function mark_gift_paid(p_gift_id uuid, p_invoice_id text default null)
returns void language plpgsql security definer as $$
begin
  update public.gifts
  set is_premium = true,
      status = 'published',
      published_at = coalesce(published_at, now())
  where id = p_gift_id;

  update public.payments
  set status = 'paid',
      paid_at = now()
  where gift_id = p_gift_id;
end;
$$;

-- ─── Migration: Security Hardening (jalankan sekali) ────────────────────────
-- Paywall hanya bisa dibuka oleh server (service role) setelah Mayar
-- mengonfirmasi pembayaran; PIN disimpan sebagai hash dan dicek di DB.

create extension if not exists pgcrypto with schema extensions;

-- 1. Client (anon/authenticated) tidak boleh mengubah kolom berbayar.
create or replace function public.protect_gift_paid_fields()
returns trigger language plpgsql as $$
begin
  if current_user not in ('anon', 'authenticated') then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.status := 'draft';
    new.is_premium := false;
    new.published_at := null;
  else
    new.status := old.status;
    new.is_premium := old.is_premium;
    new.published_at := old.published_at;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_gift_paid_fields on public.gifts;
create trigger protect_gift_paid_fields
  before insert or update on public.gifts
  for each row execute function public.protect_gift_paid_fields();

-- 2. Hanya server yang boleh menandai lunas.
drop function if exists public.mark_gift_paid(uuid, text);
drop policy if exists "service role can update payments" on public.payments;
create unique index if not exists payments_invoice_idx on public.payments (mayar_invoice_id);

-- 3. PIN: hash di tabel terpisah tanpa policy (tak terbaca dari client).
alter table public.gifts add column if not exists has_passcode boolean not null default false;

create table if not exists public.gift_passcodes (
  gift_id         uuid primary key references public.gifts(id) on delete cascade,
  hash            text not null,
  failed_attempts integer not null default 0,
  locked_until    timestamptz
);
alter table public.gift_passcodes enable row level security;

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'gifts' and column_name = 'passcode') then
    insert into public.gift_passcodes (gift_id, hash)
      select id, extensions.crypt(lower(trim(passcode)), extensions.gen_salt('bf'))
      from public.gifts where coalesce(trim(passcode), '') <> ''
      on conflict (gift_id) do nothing;
    update public.gifts set has_passcode = true where coalesce(trim(passcode), '') <> '';
    alter table public.gifts drop column passcode;
  end if;
end $$;

-- Kartu kado ber-PIN hanya bisa diambil lewat unlock_gift().
drop policy if exists "public can read cards of published gifts" on public.cards;
create policy "public can read cards of published gifts"
  on public.cards for select using (
    exists (
      select 1 from public.gifts
      where gifts.id = cards.gift_id and gifts.status = 'published' and not gifts.has_passcode
    )
  );

create or replace function public.set_gift_passcode(p_gift_id uuid, p_pin text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from gifts where id = p_gift_id and user_id = auth.uid()) then
    raise exception 'not owner';
  end if;
  if coalesce(trim(p_pin), '') = '' then
    delete from gift_passcodes where gift_id = p_gift_id;
    update gifts set has_passcode = false where id = p_gift_id;
  else
    insert into gift_passcodes (gift_id, hash)
      values (p_gift_id, extensions.crypt(lower(trim(p_pin)), extensions.gen_salt('bf')))
      on conflict (gift_id) do update set hash = excluded.hash, failed_attempts = 0, locked_until = null;
    update gifts set has_passcode = true where id = p_gift_id;
  end if;
end;
$$;
revoke execute on function public.set_gift_passcode(uuid, text) from public, anon;
grant execute on function public.set_gift_passcode(uuid, text) to authenticated;

-- Mengembalikan kartu bila PIN benar; null bila salah. Kunci 15 menit setelah 5x salah.
create or replace function public.unlock_gift(p_slug text, p_pin text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_gift_id uuid;
  v_pc gift_passcodes%rowtype;
begin
  select id into v_gift_id from gifts where slug = p_slug and status = 'published';
  if v_gift_id is null then return null; end if;

  select * into v_pc from gift_passcodes where gift_id = v_gift_id for update;
  if found then
    if v_pc.locked_until is not null and v_pc.locked_until > now() then
      raise exception 'locked';
    end if;
    if extensions.crypt(lower(trim(coalesce(p_pin, ''))), v_pc.hash) <> v_pc.hash then
      update gift_passcodes
        set failed_attempts = case when v_pc.failed_attempts + 1 >= 5 then 0 else v_pc.failed_attempts + 1 end,
            locked_until = case when v_pc.failed_attempts + 1 >= 5 then now() + interval '15 minutes' else null end
        where gift_id = v_gift_id;
      return null;
    end if;
    update gift_passcodes set failed_attempts = 0, locked_until = null where gift_id = v_gift_id;
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', id, 'order_index', order_index, 'text_content', text_content, 'image_url', image_url
    ) order by order_index)
    from cards where gift_id = v_gift_id
  ), '[]'::jsonb);
end;
$$;
grant execute on function public.unlock_gift(text, text) to anon, authenticated;
