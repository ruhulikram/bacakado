-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New Query)

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table public.gifts (
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

create table public.cards (
  id           uuid primary key default gen_random_uuid(),
  gift_id      uuid references public.gifts(id) on delete cascade not null,
  order_index  integer     not null default 0,
  text_content text        not null default '',
  image_url    text,
  created_at   timestamptz not null default now()
);

create table public.replies (
  id           uuid primary key default gen_random_uuid(),
  gift_id      uuid references public.gifts(id) on delete cascade not null,
  sender_name  text        not null,
  message      text        not null,
  created_at   timestamptz not null default now()
);

create table public.gift_views (
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
create policy "public can read published gifts"
  on public.gifts for select using (status = 'published');

create policy "owner can read own gifts"
  on public.gifts for select using (auth.uid() = user_id);

create policy "owner can insert gifts"
  on public.gifts for insert with check (auth.uid() = user_id);

create policy "owner can update gifts"
  on public.gifts for update using (auth.uid() = user_id);

create policy "owner can delete gifts"
  on public.gifts for delete using (auth.uid() = user_id);

-- Cards
create policy "public can read cards of published gifts"
  on public.cards for select using (
    exists (
      select 1 from public.gifts
      where gifts.id = cards.gift_id and gifts.status = 'published'
    )
  );

create policy "owner can manage cards"
  on public.cards for all using (
    exists (
      select 1 from public.gifts
      where gifts.id = cards.gift_id and gifts.user_id = auth.uid()
    )
  );

-- Replies
create policy "anyone can reply to published gifts"
  on public.replies for insert with check (
    exists (
      select 1 from public.gifts
      where gifts.id = replies.gift_id and gifts.status = 'published'
    )
  );

create policy "owner can read replies"
  on public.replies for select using (
    exists (
      select 1 from public.gifts
      where gifts.id = replies.gift_id and gifts.user_id = auth.uid()
    )
  );

-- Gift views
create policy "anyone can record a view"
  on public.gift_views for insert with check (true);

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
create policy "public can view gift images"
  on storage.objects for select
  using (bucket_id = 'gift-images');

-- Allow anyone to upload images for gift cards
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
  amount           numeric not null default 4000,
  status           text not null default 'pending'
                     check (status in ('pending', 'paid', 'failed', 'expired')),
  created_at       timestamptz not null default now(),
  paid_at          timestamptz
);

alter table public.payments enable row level security;

create policy "owner can read own payments"
  on public.payments for select using (auth.uid() = user_id);

create policy "owner can insert own payments"
  on public.payments for insert with check (auth.uid() = user_id);

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

