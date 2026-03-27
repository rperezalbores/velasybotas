-- Run this in your Supabase project: Dashboard → SQL Editor → New query
-- If re-running on an existing table, scroll to the bottom for the ALTER/migration section.

create table if not exists comments (
  id          uuid        default gen_random_uuid() primary key,
  entry_id    text        not null,   -- "{trip-slug}/{leg-slug}/{entry-slug}"
  author_name text        not null,
  author_email text,                  -- stored but never returned to client
  body        text        not null,
  approved    boolean     default true,
  created_at  timestamptz default now(),

  -- Column-level constraints (database-enforced, independent of API validation)
  constraint author_name_length check (char_length(author_name) between 1 and 100),
  constraint body_length         check (char_length(body) between 1 and 5000),
  constraint entry_id_format     check (entry_id ~ '^[a-z0-9\-]+/[a-z0-9\-]+/[\w.\-]+$')
);

create index if not exists comments_entry_id_idx on comments(entry_id);

-- Row-level security
alter table comments enable row level security;

-- Anyone can read approved comments
create policy "Public read approved comments"
  on comments for select
  using (approved = true);

-- Public insert: enforce required fields and format at the DB level
-- This is a second line of defence after the API-layer validation.
create policy "Public insert comments"
  on comments for insert
  with check (
    author_name is not null and char_length(author_name) between 1 and 100 and
    body        is not null and char_length(body)        between 1 and 5000 and
    entry_id    is not null and entry_id ~ '^[a-z0-9\-]+/[a-z0-9\-]+/[\w.\-]+$'
  );

-- ============================================================
-- MIGRATION: run these if the table already exists in Supabase
-- (skip the CREATE TABLE block above and run only these)
-- ============================================================

-- alter table comments
--   add constraint author_name_length
--     check (char_length(author_name) between 1 and 100),
--   add constraint body_length
--     check (char_length(body) between 1 and 5000),
--   add constraint entry_id_format
--     check (entry_id ~ '^[a-z0-9\-]+/[a-z0-9\-]+/[\w.\-]+$');

-- drop policy if exists "Public insert comments" on comments;
-- create policy "Public insert comments"
--   on comments for insert
--   with check (
--     author_name is not null and char_length(author_name) between 1 and 100 and
--     body        is not null and char_length(body)        between 1 and 5000 and
--     entry_id    is not null and entry_id ~ '^[a-z0-9\-]+/[a-z0-9\-]+/[\w.\-]+$'
--   );
