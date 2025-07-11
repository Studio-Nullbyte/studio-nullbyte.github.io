# Sign-In Issue Fix Guide

## Problem
The sign-in button shows a loading spinner but doesn't complete the authentication process.

## Root Cause
This is most likely due to missing or incorrect Supabase environment variables.

## Solution

### Step 1: Check Environment Variables

1. Look for a file called `.env.local` in your project root
2. If it doesn't exist, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. Edit `.env.local` and replace the placeholder values:
   ```bash
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # App Configuration
   VITE_APP_TITLE=Studio Nullbyte
   ```

### Step 2: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select your existing project
3. Go to Settings → API
4. Copy the following values:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`

### Step 3: Restart Development Server

After updating the environment variables:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 4: Test the Fix

1. Open your browser developer tools (F12)
2. Go to the Console tab
3. Navigate to your app
4. Look for a message like:
   ```
   Supabase configuration: { url: 'Set', key: 'Set', urlLength: 54, keyLength: 180 }
   ```

If you see "Missing" instead of "Set", the environment variables are not loaded correctly.

### Step 5: Set Up Database (If Needed)

If this is your first time setting up authentication, you'll also need to create the user profiles table:

1. Go to your Supabase project dashboard
2. Go to SQL Editor
3. Run this SQL:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### Step 6: Test Sign-In

1. Try signing in with valid credentials
2. Check the console for debug messages
3. The authentication should now work properly

## Troubleshooting

### Still Having Issues?

1. **Check Browser Console**: Look for error messages or missing configuration warnings
2. **Verify Supabase Project**: Make sure your Supabase project is active and not paused
3. **Test Credentials**: Try creating a new user account first to test if registration works
4. **Check Network Tab**: Look for failed API requests to Supabase

### Common Error Messages

- "Missing Supabase environment variables" → Follow Step 1-3 above
- "Invalid login credentials" → Check email/password are correct
- "Email not confirmed" → Check your email for verification link
- "Configuration error" → Environment variables are not set correctly

### Need Help?

If you're still having issues:
1. Check the detailed debugging messages in the console
2. Refer to `SIGNIN_DEBUG.md` for more troubleshooting steps
3. Verify your Supabase project settings and database schema
