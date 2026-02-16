/*
  # Backfill Missing Profile Records

  ## Purpose
  This migration creates profile records for any authenticated users that don't
  have a corresponding record in the public.profiles table. This fixes the
  foreign key constraint violation when those users try to create gift sites.

  ## What it does
  - Inserts profile records for users in auth.users without profiles
  - Uses user data from auth.users (id, email, metadata)
  - Is idempotent (safe to run multiple times)

  ## Why it's needed
  Some users authenticated before the trigger 'on_auth_user_created' was created,
  or the trigger may have failed for some reason, leaving them without profiles.
*/

-- Insert missing profiles for existing authenticated users
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Log the result
DO $$
DECLARE
  inserted_count INTEGER;
BEGIN
  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RAISE NOTICE 'Backfilled % missing profile record(s)', inserted_count;
END $$;
