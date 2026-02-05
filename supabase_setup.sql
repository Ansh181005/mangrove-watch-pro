-- Drop tables if they exist to reset (careful in production!)
drop table if exists incidents;
drop table if exists profiles;

-- Create profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text,
  full_name text,
  avatar_url text,
  website text,
  email text,
  type text check (type in ('NGO', 'Community', 'Individual', 'Government')) default 'Individual',
  role text check (role in ('admin', 'user')) default 'user',
  location text default 'Unknown',
  points int default 0,
  tier text default 'Bronze',
  department text,
  job_title text,
  notifications jsonb default '{"newIncidents": true, "weeklyReports": true, "systemAlerts": true}'::jsonb,
  join_date timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create incidents table
create table incidents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  type text not null,
  location text not null,
  reporter_id uuid references profiles(id),
  reporter_name text default 'Anonymous'::text,
  status text check (status in ('new', 'investigating', 'resolved', 'dismissed')) default 'new',
  severity text check (severity in ('low', 'medium', 'high', 'critical')) default 'medium',
  description text
);

-- Enable RLS on incidents
alter table incidents enable row level security;

create policy "Enable read access for all users"
  on incidents for select
  to public
  using (true);

create policy "Enable insert for authenticated users only"
  on incidents for insert
  to authenticated
  with check (true);

create policy "Enable update for authenticated users only"
  on incidents for update
  to authenticated
  using (true);

-- Function to handle new user signup with Role assignment
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'name', 
    new.raw_user_meta_data->>'avatar_url', 
    new.email,
    CASE 
      WHEN new.email = 'patellprakshil@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  );
  return new;
end;
$$;

-- Trigger to call the function on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Function to award points on Incident Resolution
create or replace function public.handle_incident_update()
returns trigger
language plpgsql
security definer
as $$
begin
  -- If status changed to 'resolved' from something else
  if new.status = 'resolved' and old.status != 'resolved' then
    update public.profiles
    set points = points + 50
    where id = new.reporter_id;
  end if;
  return new;
end;
$$;

-- Trigger for incident updates
drop trigger if exists on_incident_update on incidents;
create trigger on_incident_update
  after update on incidents
  for each row execute procedure public.handle_incident_update();

-- Insert dummy incidents (optional)
insert into incidents (type, location, reporter_name, status, severity, description) values
('Illegal Logging', 'Mangrove Sector A-7', 'Marine Bio NGO', 'new', 'high', 'Large-scale tree cutting observed in protected zone'),
('Unauthorized Fishing', 'Coastal Zone B-12', 'Local Fisherman', 'investigating', 'medium', 'Commercial fishing nets found in restricted breeding area'),
('Pollution Discharge', 'River Delta C-3', 'EcoGuardians', 'resolved', 'critical', 'Industrial waste discharge affecting water quality'),
('Wildlife Poaching', 'Protected Area D-9', 'Coastal Watch', 'investigating', 'high', 'Evidence of bird trapping and habitat destruction'),
('Land Reclamation', 'Mangrove Sector E-4', 'Community Leader', 'dismissed', 'low', 'Small-scale unauthorized landfill in mangrove area');
