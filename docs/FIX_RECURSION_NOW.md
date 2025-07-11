# 🚨 CRITICAL FIX: Infinite Recursion in user_profiles RLS Policies

## The Problem
Your RLS policies are checking user roles by querying the same `user_profiles` table they're protecting, creating infinite recursion.

## IMMEDIATE SOLUTION - Run in Supabase Dashboard

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to "SQL Editor" in the left sidebar
4. Create a new query

### Step 2: Copy and Paste This EXACT SQL Code

```sql
-- STEP 1: Remove all problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;

-- STEP 2: Temporarily disable RLS to clean up
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- STEP 3: Clean up any existing data issues (optional)
-- This ensures all users have proper IDs
UPDATE user_profiles SET updated_at = NOW() WHERE updated_at IS NULL;

-- STEP 4: Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create SIMPLE, NON-RECURSIVE policies

-- Allow users to see their own profile (uses auth.uid() - no table lookup!)
CREATE POLICY "user_select_own" ON user_profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to insert their own profile on first signup
CREATE POLICY "user_insert_own" ON user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "user_update_own" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

-- STEP 6: Create admin policy using EMAIL (not table lookup!)
-- REPLACE 'studionullbyte@gmail.com' with your actual admin email
CREATE POLICY "admin_full_access" ON user_profiles
FOR ALL USING (
  auth.jwt() ->> 'email' = 'studionullbyte@gmail.com'
);

-- STEP 7: Grant permissions
GRANT ALL ON user_profiles TO authenticated;
GRANT SELECT ON user_profiles TO anon;
```

### Step 3: Update Admin Email
- In the SQL above, find this line:
  ```sql
  auth.jwt() ->> 'email' = 'studionullbyte@gmail.com'
  ```
- Replace `studionullbyte@gmail.com` with YOUR actual admin email address
- Keep the single quotes around your email

### Step 4: Run the SQL
1. Click "Run" button in Supabase SQL Editor
2. You should see "Success. No rows returned" or similar
3. If you get errors, check that you replaced the email correctly

## Test the Fix

After running the SQL:

1. **Refresh your website**
2. **Login with your admin email**
3. **Open the debug panel** 
4. **Click "Check Database"** - should work now!
5. **Click "Create Admin Profile"** - should create your admin profile
6. **Refresh page** - admin links should appear in header

## If It Still Doesn't Work

If you still get recursion errors:

1. **Double-check the email** in the admin policy matches your login email exactly
2. **Try this emergency SQL** to completely reset:

```sql
-- Nuclear option - completely reset the table policies
DROP POLICY IF EXISTS "user_select_own" ON user_profiles;
DROP POLICY IF EXISTS "user_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "user_update_own" ON user_profiles;
DROP POLICY IF EXISTS "admin_full_access" ON user_profiles;

ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Just allow authenticated users for now
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_authenticated" ON user_profiles
FOR ALL USING (auth.role() = 'authenticated');
```

## What This Fix Does

- ✅ **Removes circular dependencies** - no more table lookups in policies
- ✅ **Uses auth.uid()** - direct from authentication, no recursion
- ✅ **Admin access via email** - checks JWT token directly
- ✅ **Simple and reliable** - minimal complexity

The key is that the new policies use `auth.uid()` and `auth.jwt()` which come directly from the authentication system, NOT from database table lookups.
