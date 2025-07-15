# Admin Orders Troubleshooting Guide

## Issue: Loading indicator spins indefinitely on the admin orders page

### Potential Causes & Solutions:

1. **Database Tables Missing**
   - Check if the required tables exist in your Supabase database:
     - `orders`
     - `order_items` 
     - `user_profiles`
     - `products`
     - `categories`

2. **Row Level Security (RLS) Issues**
   - Make sure your user profile has the `admin` role set
   - Check if RLS policies allow admin users to read orders

3. **Supabase Connection Issues**
   - Verify your Supabase URL and API key in the environment variables
   - Check if the Supabase client is configured correctly

### Quick Diagnostic Steps:

1. **Use the "Run Diagnostics" button** in the admin orders page header
   - This will check if all required tables are accessible
   - Shows which tables are missing or inaccessible

2. **Check the browser console** for error messages
   - Look for Supabase errors
   - Check for network failures

3. **Verify your admin status**
   - Make sure your user profile has `role = 'admin'`
   - Check the user_profiles table in Supabase

### Database Setup:

If tables are missing, run the SQL script in `database-setup.sql` in your Supabase SQL editor.

### Common Error Messages:

- **"table does not exist"**: Run the database setup script
- **"permission denied"**: Check RLS policies and admin role
- **"Request timed out"**: Network or Supabase instance issues

### Manual Testing:

1. Open Supabase dashboard
2. Go to Table Editor
3. Check if these tables exist and have data:
   - orders (should have some test orders)
   - user_profiles (should have your user with role='admin')
   - products (should have some products)

### Creating Test Data:

You can create a test order manually in Supabase:

```sql
-- Insert a test order
INSERT INTO orders (user_id, total_amount, status, payment_method) 
VALUES (
  (SELECT user_id FROM user_profiles WHERE role = 'admin' LIMIT 1),
  29.99,
  'pending',
  'test'
);
```
