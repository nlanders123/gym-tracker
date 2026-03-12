-- Body weight tracking
create table body_weight (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  date date not null default current_date,
  weight_kg numeric(5,1) not null,
  created_at timestamp with time zone default now(),
  unique(user_id, date)
);

create index idx_body_weight_user on body_weight(user_id, date desc);

alter table body_weight enable row level security;

create policy "Users can read own weight" on body_weight for select using (auth.uid() = user_id);
create policy "Users can insert own weight" on body_weight for insert with check (auth.uid() = user_id);
create policy "Users can update own weight" on body_weight for update using (auth.uid() = user_id);
create policy "Users can delete own weight" on body_weight for delete using (auth.uid() = user_id);
