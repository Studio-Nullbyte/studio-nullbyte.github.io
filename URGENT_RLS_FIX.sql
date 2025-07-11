-- URGENT: Fix for infinite recursion in user_profiles RLS policies
-- Run these commands in your Supabase SQL Editor Dashboard

-- 1. FIRST: Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;

-- 2. Temporarily disable RLS to fix the table
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 3. Create a simple, non-recursive policy structure
-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create new NON-RECURSIVE policies
-- Policy for users to see their own profile (uses auth.uid() directly, no table lookups)
CREATE POLICY "Enable select for own profile" ON user_profiles
FOR SELECT USING (auth.uid() = id);

-- Policy for users to insert their own profile (first time setup)
CREATE POLICY "Enable insert for own profile" ON user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Enable update for own profile" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

-- 5. Create a separate admin bypass policy using a different approach
-- This policy allows admin users based on email domain or specific emails
-- Replace 'your-admin-email@domain.com' with your actual admin email
CREATE POLICY "Enable admin access" ON user_profiles
FOR ALL USING (
  auth.jwt() ->> 'email' = 'studionullbyte@gmail.com' 
  OR auth.jwt() ->> 'email' = 'your-admin-email@domain.com'
);

-- 6. Grant necessary permissions
GRANT ALL ON user_profiles TO authenticated;
GRANT SELECT ON user_profiles TO anon;

-- 7. Test query (should work without recursion)
-- SELECT * FROM user_profiles WHERE id = auth.uid();
