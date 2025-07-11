# Fix for RLS Infinite Recursion Error

## Problem
Database error: "infinite recursion detected in policy for relation 'user_profiles'"

This happens when RLS policies on the `user_profiles` table reference the same table they're protecting, creating a circular dependency.

## Solution

Run these SQL commands in your Supabase SQL Editor to fix the policies:

```sql
-- First, drop all existing policies for user_profiles to clear the recursion
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Create simple, non-recursive policies
-- 1. Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- 2. Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. Allow authenticated users to read all profiles (needed for admin checks)
CREATE POLICY "Authenticated users can view all profiles" ON public.user_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Verify RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
```

## Alternative Simpler Fix (If Above Doesn't Work)

If you still get recursion errors, temporarily disable RLS for user_profiles:

```sql
-- Disable RLS temporarily to fix the immediate issue
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
```

⚠️ **Note**: Disabling RLS removes security restrictions, so only do this temporarily for testing.

## After Running the Fix

1. Go back to your app
2. Use the "Check Database" button in the debug panel
3. It should now work without the recursion error
4. Click "Create Admin Profile" to set up your admin role
5. Refresh the page to see the admin links

## Understanding the Issue

The recursion happened because:
- Admin policies checked `user_profiles.role = 'admin'`
- But to check that, Postgres had to query `user_profiles`
- Which triggered the same policy again
- Creating an infinite loop

The fix uses simpler policies that don't create circular references.
