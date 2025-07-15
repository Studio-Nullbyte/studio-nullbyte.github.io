# GitHub Secrets Setup for Environment Variables

## 🔐 **Step-by-Step Guide**

### 1. Go to Repository Settings
1. Go to your GitHub repository: `https://github.com/Studio-Nullbyte/studio-nullbyte.github.io`
2. Click **Settings** (tab at the top)
3. In the left sidebar, click **Secrets and variables** → **Actions**

### 2. Add Repository Secrets
Click **"New repository secret"** and add each of these:

#### Secret 1: VITE_SUPABASE_URL
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `your_supabase_project_url_here` (from your .env file)

#### Secret 2: VITE_SUPABASE_ANON_KEY  
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `your_supabase_anon_key_here` (from your .env file)

#### Secret 3: VITE_STRIPE_PUBLISHABLE_KEY
- **Name**: `VITE_STRIPE_PUBLISHABLE_KEY`  
- **Value**: `pk_live_51RlCWuP59y3jEuN3gIe4hsjMbigZtdb9iIGCO7jk5a0O9lNFYRl5iJTlJTOZseBW8KPWTEmQh6ApI2y9gcno10A800CSEfdgPo` (from your .env file)

#### Secret 4: VITE_CRISP_WEBSITE_ID
- **Name**: `VITE_CRISP_WEBSITE_ID`
- **Value**: `your-crisp-website-id` (from Crisp Dashboard after signup)

### 3. Verify Setup
After adding all secrets, you should see:
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY  
- ✅ VITE_STRIPE_PUBLISHABLE_KEY
- ✅ VITE_CRISP_WEBSITE_ID

### 4. Test the Build
1. **Commit and push** any changes to trigger the GitHub Action
2. Go to **Actions** tab in your repository
3. Watch the build process - it should now have access to your environment variables
4. If successful, your site will be deployed to GitHub Pages with Stripe working!

## 🛡️ **Security Benefits**

- ✅ **Environment variables are secure** - Only visible to repository maintainers
- ✅ **No sensitive data in code** - Your .env file stays local
- ✅ **Encrypted storage** - GitHub encrypts all secrets
- ✅ **Limited access** - Only GitHub Actions can read these values

## 📁 **File Status**

### Keep Local (Never Commit):
- ❌ `.env` - Contains your actual secrets
- ❌ `.env.local` - Local development overrides

### Safe to Commit:
- ✅ `.env.example` - Template with placeholder values
- ✅ GitHub Actions workflow - Uses secret references

## 🔧 **Alternative: Environment Template**

You could create a `.env.example` file (safe to commit):

```properties
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration  
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_or_pk_live_your_stripe_key_here

# App Configuration
VITE_APP_TITLE=Studio Nullbyte
```

This helps other developers know what environment variables they need.

## 🚀 **Next Steps**

1. **Set up the GitHub Secrets** using the values from your local `.env` file
2. **Push your code** to trigger a new build
3. **Check the Actions tab** to see if the build succeeds
4. **Test your deployed site** to ensure Stripe integration works

After this setup, your GitHub Pages deployment will have access to all the environment variables it needs! 🎉
