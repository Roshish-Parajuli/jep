-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Handle new user signup trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Create gift_sites table
create table public.gift_sites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  slug text unique not null,
  template_type text not null, -- 'valentine_classic', 'valentine_ask', 'birthday', etc.
  content jsonb not null default '{}'::jsonb,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for gift_sites
alter table public.gift_sites enable row level security;

create policy "Public sites are viewable by everyone."
  on gift_sites for select
  using ( true );

create policy "Users can insert their own sites."
  on gift_sites for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own sites."
  on gift_sites for update
  using ( auth.uid() = user_id );

create policy "Users can delete own sites."
  on gift_sites for delete
  using ( auth.uid() = user_id );


-- Create gift_cards table
create table public.gift_cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  template_id text not null, -- e.g., 'story_simple', 'story_animated'
  content jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for gift_cards
alter table public.gift_cards enable row level security;

create policy "Public cards are viewable by everyone."
  on gift_cards for select
  using ( true );

create policy "Users can insert their own cards."
  on gift_cards for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own cards."
  on gift_cards for update
  using ( auth.uid() = user_id );

create policy "Users can delete own cards."
  on gift_cards for delete
  using ( auth.uid() = user_id );
