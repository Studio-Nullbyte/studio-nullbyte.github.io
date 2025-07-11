# Sign-In Debug Guide

## Issue Description
User clicks sign-in button, loading spinner appears but no content is shown and user is not redirected.

## Debugging Steps

### 1. Check Browser Console
Open Developer Tools (F12) and check the Console tab for debug messages:

Expected messages for successful sign-in:
```
Auth: Starting sign in process...
useAuth: Starting sign in...
useAuth: Sign in completed, result: {...}
useAuth: Sign in successful, user: {...}
Auth: Sign in successful, navigating...
Auth: Redirecting to: /
Auth: Setting loading to false
useAuth: Auth state change event: SIGNED_IN Session: {...}
useAuth: User logged in, fetching profile...
useAuth: Profile data: {...}
useAuth: Setting loading to false
ProtectedRoute: Checking access - {...}
ProtectedRoute: User logged in but accessing auth page, redirecting to home...
```

### 2. Check Network Tab
Look for:
- POST request to Supabase auth endpoint
- Response status (should be 200 for success)
- Any failed requests

### 3. Check Supabase Dashboard
- Go to Authentication > Users
- Verify user exists and email is confirmed
- Check if user has been created properly

### 4. Common Issues

#### Issue: Loading Spinner Never Stops
**Possible Causes:**
- Auth state change listener not firing
- Profile fetch failing
- Loading state not being cleared

**Debug:**
- Check if `useAuth: Setting loading to false` appears in console
- Verify Supabase connection is working
- Check if user_profiles table exists and is accessible

#### Issue: Sign-In Success But No Redirect
**Possible Causes:**
- Navigation not working
- ProtectedRoute logic issue
- Route configuration problem

**Debug:**
- Check if navigation messages appear in console
- Verify React Router is working properly
- Check if user is actually signed in (user object in console)

#### Issue: Error During Sign-In
**Possible Causes:**
- Invalid credentials
- Email not confirmed
- Supabase configuration issue

**Debug:**
- Check error messages in console
- Verify email/password are correct
- Check Supabase project settings

### 5. Test Steps

1. Open browser developer tools
2. Go to /auth page
3. Enter valid credentials
4. Click Sign In
5. Watch console for debug messages
6. Note where the process stops or fails

### 6. Recovery Steps

If sign-in is still not working:

1. Clear browser cache and cookies
2. Check Supabase project status
3. Verify environment variables
4. Check database schema (user_profiles table)
5. Test with a fresh user registration

### 7. Database Schema Check

Ensure the `user_profiles` table exists:
```sql
SELECT * FROM user_profiles LIMIT 1;
```

If table doesn't exist, it needs to be created for the auth flow to work properly.
