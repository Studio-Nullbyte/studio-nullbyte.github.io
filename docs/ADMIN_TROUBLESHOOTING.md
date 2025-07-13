# Admin Functionality Troubleshooting Guide

## Quick Fix Steps

### Step 1: Check Current State
1. **Start the development server**: `npm run dev`
2. **Open the app** in your browser (usually `http://localhost:5173`)
3. **Log in** with your account
4. **Look for the debug panel** in the bottom-right corner

### Step 2: Use the Debug Panel
The debug panel will show:
- ✅ User logged in status
- ✅ Profile loaded status
- ✅ Current role
- ✅ Admin status

### Step 3: Fix Based on Debug Info

**If "Profile not loaded":**
- Click "Check Database" to see what's in the database
- If no profile exists, click "Create Admin Profile"

**If "Profile loaded but role is not admin":**
- Click "Make Admin" to update your role

**If "Database error":**
- You need to run the database schema update (see below)

## Database Schema Update

If you're getting database errors, you need to run the updated schema:

1. **Go to your Supabase dashboard**
2. **Open the SQL Editor**
3. **Run this complete schema** (copy the entire content of `supabase/schema.sql`)
4. **Verify the schema** by running:
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'user_profiles';
   ```
   You should see `role` and `is_active` columns.

## Manual Admin Creation

If the debug panel doesn't work, manually create an admin user:

1. **In Supabase SQL Editor**, run:
   ```sql
   -- Check if your profile exists
   SELECT * FROM user_profiles WHERE email = 'your-email@example.com';
   
   -- If profile exists, update role
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   
   -- If no profile, create one (replace with your actual data)
   INSERT INTO user_profiles (user_id, email, full_name, role)
   VALUES (
     'your-user-id-from-auth-users',
     'your-email@example.com',
     'Your Full Name',
     'admin'
   );
   ```

2. **Find your user_id** by running:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   ```

## Expected Behavior After Fix

Once the admin role is set correctly, you should see:

1. **In the main navigation** (desktop): An "Admin" link with shield icon
2. **In the user dropdown menu**: 
   - "Admin" section with purple text
   - Links to Dashboard, Products, Users, Categories, Orders, Messages

3. **Admin routes should be accessible**:
   - `/admin` - Dashboard
   - `/admin/products` - Product management
   - `/admin/users` - User management
   - `/admin/categories` - Category management
   - `/admin/orders` - Order management
   - `/admin/contacts` - Contact submissions

## Common Issues & Solutions

### Issue: "Failed to load users"
**Solution**: Database schema missing `role` column. Run the schema update.

### Issue: "Access denied" on admin routes
**Solution**: User role is not 'admin'. Update the role in the database.

### Issue: Admin links not showing
**Solution**: Profile not loaded or role not set. Use the debug panel to fix.

### Issue: Database connection errors
**Solution**: Check your Supabase configuration in `src/lib/supabase.ts`.

## Remove Debug Panel

Once everything is working, remove the debug panel:

1. **Remove the import** from `src/App.tsx`:
   ```tsx
   import { AuthDebugger } from './components/AuthDebugger'
   ```

2. **Remove the component** from the JSX:
   ```tsx
   <AuthDebugger />
   ```

## Need Help?

If you're still having issues:
1. Check the browser console for errors
2. Check the network tab for failed API calls
3. Verify your Supabase project is running
4. Check that RLS policies are properly configured

The debug panel should help identify the exact issue and provide a one-click solution!
