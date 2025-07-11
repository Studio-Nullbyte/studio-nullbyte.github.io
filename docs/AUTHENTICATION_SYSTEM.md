# 🔐 User Authentication System

A comprehensive authentication system for Studio Nullbyte with user registration, login, password reset, and profile management.

## ✨ Features

### 🔑 Authentication
- **User Registration**: Create new accounts with email verification
- **User Login**: Secure password-based authentication  
- **Password Reset**: Email-based password recovery
- **Session Management**: Persistent authentication state
- **Automatic Profile Creation**: User profiles created on signup

### 👤 User Management
- **Profile Settings**: Edit name, email, and personal information
- **Password Change**: Update passwords securely
- **Account Settings**: Comprehensive user preferences
- **Download History**: Track purchased templates (ready for future)

### 🛡️ Security Features
- **Row Level Security (RLS)**: Database-level access control
- **Protected Routes**: Authentication-required pages
- **Session Persistence**: Maintain login state across sessions
- **Password Validation**: Secure password requirements
- **Email Verification**: Confirm account ownership

## 📁 File Structure

```
src/
├── hooks/
│   └── useAuth.ts                 # Main authentication hook
├── contexts/
│   └── AuthContext.tsx           # React context for auth state
├── components/
│   ├── AuthForm.tsx              # Reusable auth form component
│   └── ProtectedRoute.tsx        # Route protection wrapper
├── pages/
│   ├── Auth.tsx                  # Login/register page
│   ├── ResetPassword.tsx         # Password reset page
│   └── UserSettings.tsx          # User profile/settings
└── lib/
    └── supabase.ts              # Supabase client configuration
```

## 🚀 Pages & Routes

### Public Routes
- `/auth` - Login/register page with mode switching
- `/auth?mode=register` - Direct link to registration
- `/auth?mode=reset` - Direct link to password reset
- `/reset-password` - Password reset confirmation

### Protected Routes  
- `/settings` - User account settings and profile management

### Route Protection
Routes are protected using the `ProtectedRoute` component that:
- Redirects unauthenticated users to `/auth?redirect=<current-path>`
- Prevents authenticated users from accessing auth pages
- Shows loading spinner while checking authentication state

## 🎨 UI Components

### AuthForm Component
A comprehensive form component that handles:
- **Login Mode**: Email/password authentication
- **Register Mode**: Email/password/name registration  
- **Reset Mode**: Email-only password recovery
- **Validation**: Real-time form validation with error messages
- **Loading States**: Visual feedback during API calls
- **Mode Switching**: Toggle between login/register/reset

### Header Integration
The header component includes:
- **User Menu**: Profile dropdown for authenticated users
- **Sign In Button**: Quick access to authentication for guests
- **Mobile Support**: Responsive auth links in mobile menu
- **Profile Display**: Shows user name or email in header

### User Settings Page
Comprehensive settings interface with:
- **Profile Tab**: Update name and email address
- **Security Tab**: Change password securely
- **Downloads Tab**: Future download history (placeholder)
- **Navigation**: Tabbed interface for organization

## 🔧 Authentication Flow

### Registration Process
1. User fills registration form (name, email, password)
2. Form validation (email format, password strength, matching passwords)
3. Supabase creates auth user with metadata
4. Database trigger automatically creates user profile
5. Email verification sent (optional, configurable)
6. Success message displayed

### Login Process  
1. User enters email and password
2. Form validation
3. Supabase authentication
4. User profile fetched from database
5. Redirect to intended page or home
6. Header updates with user info

### Password Reset Process
1. User enters email on reset form
2. Supabase sends reset email with magic link
3. User clicks email link → redirected to `/reset-password`
4. User sets new password
5. Password updated in Supabase
6. User signed out and redirected to login

### Profile Management
1. User navigates to `/settings`
2. Profile data loaded from database
3. User updates information
4. Changes saved to `user_profiles` table
5. Real-time UI updates

## 📊 Database Schema

### User Profiles Table
```sql
create table user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Row Level Security Policies
- Users can only view their own profile
- Users can only update their own profile  
- Public read access for product data
- Admin-only access for sensitive operations

### Automatic Profile Creation
```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;
```

## 🛠️ API Integration

### useAuth Hook
Provides authentication state and actions:

```typescript
const {
  user,           // Current Supabase user
  session,        // Current session
  loading,        // Loading state
  profile,        // User profile from database
  signUp,         // Register new user
  signIn,         // Login user
  signOut,        // Logout user  
  resetPassword,  // Send reset email
  updateProfile,  // Update user profile
  updatePassword, // Change password
  refreshProfile  // Reload profile data
} = useAuth()
```

### AuthContext
React context that wraps the entire app:

```typescript
<AuthProvider>
  <App />
</AuthProvider>
```

## 🎯 Usage Examples

### Protecting a Route
```typescript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Using Auth State in Component
```typescript
import { useAuthContext } from '../contexts/AuthContext'

function MyComponent() {
  const { user, profile, signOut } = useAuthContext()
  
  if (!user) return <div>Please log in</div>
  
  return (
    <div>
      <h1>Welcome, {profile?.full_name || user.email}!</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Conditional Rendering
```typescript
{user ? (
  <UserDashboard />
) : (
  <SignInPrompt />
)}
```

## 🔍 Testing Authentication

### Manual Testing Checklist

#### Registration Flow
- [ ] Navigate to `/auth?mode=register`
- [ ] Fill valid registration form
- [ ] Verify email validation
- [ ] Verify password matching
- [ ] Submit form and check success message
- [ ] Verify profile created in database

#### Login Flow  
- [ ] Navigate to `/auth`
- [ ] Enter valid credentials
- [ ] Verify redirect to intended page
- [ ] Check header shows user info
- [ ] Verify user menu functionality

#### Password Reset
- [ ] Click "Forgot password" link
- [ ] Enter email address
- [ ] Check email for reset link
- [ ] Click reset link
- [ ] Set new password
- [ ] Verify login with new password

#### Profile Management
- [ ] Navigate to `/settings`
- [ ] Update profile information
- [ ] Change password
- [ ] Verify changes persist
- [ ] Test form validation

#### Route Protection
- [ ] Try accessing `/settings` without login
- [ ] Verify redirect to auth page
- [ ] Login and verify redirect back to settings
- [ ] Try accessing `/auth` while logged in
- [ ] Verify redirect to home page

## 🚨 Troubleshooting

### Common Issues

#### "Missing Supabase environment variables"
- Check `.env.local` has correct values
- Verify Vite recognizes `VITE_` prefixed variables
- Restart development server after env changes

#### Profile not loading
- Check user is authenticated 
- Verify database trigger created profile
- Check browser console for errors
- Try refreshing profile with `refreshProfile()`

#### Password reset not working
- Verify email settings in Supabase dashboard
- Check spam folder for reset emails
- Ensure redirect URL matches site domain
- Check Supabase auth logs for errors

#### Route protection issues
- Verify `AuthProvider` wraps entire app
- Check `ProtectedRoute` is used correctly
- Ensure auth state is not loading
- Check browser network tab for auth calls

## 📈 Future Enhancements

### Planned Features
- **Social Authentication**: Google, GitHub, Discord login
- **Two-Factor Authentication**: SMS or authenticator app
- **Account Deletion**: Self-service account removal
- **Profile Pictures**: Avatar upload and management
- **Email Change**: Verification flow for email updates
- **Session Management**: View/revoke active sessions
- **Download History**: Track purchased templates
- **Wishlist**: Save products for later
- **Purchase History**: Order tracking and receipts

### Technical Improvements
- **Rate Limiting**: Prevent brute force attacks
- **Account Lockout**: Temporary disable after failed attempts
- **Audit Logging**: Track authentication events
- **Session Timeout**: Automatic logout after inactivity
- **Remember Me**: Extended session duration option
- **Device Management**: Track and manage logged-in devices

## 🔒 Security Considerations

### Current Security Measures
- Row Level Security (RLS) on all tables
- Password hashing handled by Supabase
- HTTPS-only cookies for sessions
- Email verification for account security
- Protected API routes with authentication

### Security Best Practices
- Never store passwords in plain text
- Use HTTPS in production
- Implement CSRF protection
- Regular security audits
- Monitor authentication logs
- Keep dependencies updated

---

## 🎉 Summary

The Studio Nullbyte authentication system provides a complete, secure, and user-friendly authentication experience with:

- ✅ **Complete User Flow**: Registration → Login → Profile Management
- ✅ **Security First**: RLS, password validation, email verification  
- ✅ **Great UX**: Responsive design, loading states, error handling
- ✅ **Developer Friendly**: Type-safe hooks, reusable components
- ✅ **Production Ready**: Error handling, validation, security measures

Users can now create accounts, log in securely, manage their profiles, and access protected features throughout the Studio Nullbyte platform! 🚀
