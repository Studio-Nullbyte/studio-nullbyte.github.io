# Supabase Integration Guide

## 🚀 Overview

Studio Nullbyte is now integrated with Supabase for backend data management, authentication, and storage. This provides a complete backend solution for the digital template marketplace.

## 📋 Features Implemented

### Authentication
- User registration and login
- Profile management
- Session handling
- Protected routes

### Database
- Products catalog with categories
- User download history
- Product reviews and ratings
- Contact form submissions
- User profiles

### API Integration
- Real-time data synchronization
- RESTful API access
- Row Level Security (RLS)
- Optimistic updates

## 🛠 Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: `studio-nullbyte`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
6. Wait for project setup (2-3 minutes)

### 2. Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Configure Environment Variables

1. Create `.env.local` file in project root:
```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_TITLE=Studio Nullbyte
```

2. Add to `.env.example` for team reference
3. Add `.env.local` to `.gitignore`

### 4. Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Run the query
5. Verify tables are created in **Table Editor**

### 5. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure these settings:
   - **Site URL**: `http://localhost:3000` (development)
   - **Redirect URLs**: Add your production domain
   - **Email confirmations**: Enable if desired
   - **Password requirements**: Set minimum complexity

### 6. Set Up Row Level Security

The schema includes RLS policies that:
- Allow public read access to products and categories
- Restrict user profiles to owners only
- Allow authenticated users to create reviews
- Protect download history per user

## 📊 Database Schema

### Tables

#### `user_profiles`
- User profile information
- Links to `auth.users`
- Stores display name, avatar, etc.

#### `categories`
- Product categories (Web, Notion, AI, etc.)
- URL-friendly slugs
- Descriptions

#### `products`
- Digital products for sale
- Pricing, descriptions, images
- Tags, featured status
- Links to categories

#### `download_history`
- Tracks user downloads
- Prevents duplicate downloads
- Analytics data

#### `reviews`
- Product ratings and comments
- 1-5 star ratings
- User attribution

#### `contact_submissions`
- Contact form data
- Status tracking
- Admin management

## 🎯 Usage Examples

### Get Products
```typescript
import { useProducts } from './hooks/useProducts'

function ProductList() {
  const { products, loading, error } = useProducts('web')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  )
}
```

### Authentication
```typescript
import { useAuthContext } from './contexts/AuthContext'

function LoginForm() {
  const { signIn, user } = useAuthContext()
  
  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password)
    if (error) console.error('Login failed:', error)
  }
  
  return user ? <div>Welcome!</div> : <LoginForm />
}
```

### Submit Contact Form
```typescript
import { submitContactForm } from './lib/supabase'

const handleSubmit = async (formData) => {
  const { data, error } = await submitContactForm(formData)
  if (error) {
    console.error('Submission failed:', error)
  } else {
    console.log('Message sent:', data)
  }
}
```

## 🔒 Security Features

### Row Level Security (RLS)
- **Products**: Public read access only
- **User Profiles**: Users can only access their own data
- **Downloads**: Users see only their download history
- **Reviews**: Public read, authenticated write
- **Contact**: Public insert only

### API Keys
- **Anon Key**: Safe for client-side use
- **Service Key**: Never expose to client
- **JWT**: Automatic user session management

## 🚀 Deployment Considerations

### Environment Variables
Add these to your deployment platform:
```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### GitHub Actions
Update `.github/workflows/deploy.yml` to include environment variables:
```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

Add secrets in GitHub:
1. Go to repository **Settings** → **Secrets and Variables** → **Actions**
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Production URLs
Update authentication settings:
- **Site URL**: `https://studio-nullbyte.github.io/studio-nullbyte.github.io/`
- **Redirect URLs**: Add your live domain

## 📈 Analytics & Monitoring

### Built-in Analytics
Supabase provides:
- Real-time database activity
- Query performance metrics
- User authentication stats
- API usage monitoring

### Custom Analytics
Track these events:
- Product views
- Download conversions
- User registrations
- Contact form submissions

## 🛡️ Backup & Recovery

### Automatic Backups
Supabase provides:
- Daily automated backups
- Point-in-time recovery
- Export capabilities

### Manual Backup
```bash
# Install Supabase CLI
npm install -g supabase

# Login and backup
supabase login
supabase db dump --db-url "postgresql://..."
```

## 🔧 Development Workflow

### Local Development
1. Start development server: `npm run dev`
2. Supabase connects to cloud instance
3. Use browser dev tools to inspect API calls
4. Test authentication flows

### Testing
```bash
# Run tests with Supabase
npm test

# Test specific features
npm run test:auth
npm run test:products
```

## 📚 Additional Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Authentication Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Community
- [Discord](https://discord.supabase.com)
- [GitHub](https://github.com/supabase/supabase)
- [YouTube](https://www.youtube.com/c/supabase)

## 🚨 Troubleshooting

### Common Issues

**Environment Variables Not Loading:**
- Restart development server after adding `.env.local`
- Check file is in project root
- Verify variable names start with `VITE_`

**Authentication Errors:**
- Check Site URL in Supabase dashboard
- Verify redirect URLs are configured
- Clear browser cookies/localStorage

**Database Connection Issues:**
- Verify project URL and anon key
- Check RLS policies
- Review network/firewall settings

**Build Failures:**
- Ensure environment variables are set in deployment
- Check TypeScript compilation
- Verify import paths

### Getting Help
1. Check Supabase dashboard for error logs
2. Review browser console for client errors
3. Test API calls with Postman/curl
4. Join Supabase Discord for community support
