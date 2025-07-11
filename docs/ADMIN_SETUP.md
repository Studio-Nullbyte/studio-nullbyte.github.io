# Admin Role Setup Guide

## Problem: Admin links not showing after login

The admin links in the header depend on the user's profile having `role = 'admin'` in the database.

## Step 1: Check Your Current Profile

After logging in, look at the **debug panel** in the bottom-right corner of the page. It will show:
- If your profile is loaded
- What your current role is
- Whether you're detected as admin

## Step 2: Make Your User an Admin

You need to update your user profile in the Supabase database to have admin role.

### Option A: Via Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Table Editor**
4. Select the `user_profiles` table
5. Find your user record (look for your email)
6. Edit the `role` column and change it from `user` to `admin`
7. Save the changes

### Option B: Via SQL Editor

1. Go to your Supabase Dashboard
2. Go to **SQL Editor**
3. Run this query (replace `your-email@example.com` with your actual email):

```sql
-- Update user role to admin
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verify the change
SELECT user_id, email, full_name, role 
FROM user_profiles 
WHERE email = 'your-email@example.com';
```

### Option C: If Profile Doesn't Exist

If you don't see your profile in the `user_profiles` table:

```sql
-- First, find your user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then create a profile with admin role (replace the UUID with your actual user ID)
INSERT INTO user_profiles (user_id, email, full_name, role)
VALUES (
  'your-user-id-from-above-query',
  'your-email@example.com',
  'Your Full Name',
  'admin'
);
```

## Step 3: Test the Fix

1. After updating the database, refresh your web page
2. Log out and log back in
3. Check the debug panel - it should now show:
   - `Role: admin`
   - `Is Admin: YES`
4. The admin link should now appear in:
   - Main navigation (desktop and mobile)
   - User dropdown menu
   - Mobile user section

## Step 4: Remove Debug Panel (Optional)

Once everything is working, you can remove the debug panel by:
1. Going to `src/App.tsx`
2. Removing the `<AuthDebugger />` component

## Troubleshooting

### Debug Panel Shows "Profile not loaded"
- The `user_profiles` table might not have a record for your user
- The profile fetch might be failing
- Check the browser console for error messages

### Debug Panel Shows "Role: user" or "Role: None"
- Your user exists but doesn't have admin role
- Follow Step 2 to update the role to admin

### Admin Link Still Not Showing
- Hard refresh the page (Ctrl+Shift+R)
- Clear browser cache
- Check browser console for JavaScript errors
- Verify the role update was saved in the database

## Expected Result

When working correctly, admin users will see:
- "Admin" link in main navigation (with shield icon)
- Full admin menu in user dropdown
- Access to `/admin`, `/admin/products`, `/admin/users`, `/admin/orders`

The debug panel will show:
```
Role: admin
Is Admin: YES
```
