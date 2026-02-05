-- 1. Fix the admin user's role (targeting the correct 'role' column this time)
-- We previously mistakenly tried to update 'type', which has strict check constraints.
UPDATE public.profiles
SET role = 'admin',
    type = 'Individual' -- Ensuring type satisfies the check constraint
WHERE email = 'patellprakshil@gmail.com';

-- 2. Ensure everyone else is a user
UPDATE public.profiles
SET role = 'user'
WHERE email != 'patellprakshil@gmail.com' AND (role IS NULL OR role = 'admin');

-- 3. Create the points increment function required for the Gamification feature
CREATE OR REPLACE FUNCTION increment_points(user_id UUID, amount INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET points = COALESCE(points, 0) + amount
  WHERE id = user_id;
END;
$$;
