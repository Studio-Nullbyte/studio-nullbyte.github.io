# 🚀 Deployment Guide with Supabase

## Overview

Your Studio Nullbyte site will **NOT** automatically connect to Supabase when deployed to GitHub Pages unless you configure the environment variables properly. Here's how to set it up.

## 🔐 Step-by-Step Deployment Setup

### 1. Configure GitHub Secrets

Your Supabase credentials need to be stored as GitHub Secrets for secure deployment.

#### Add Secrets to GitHub Repository:

1. Go to your repository on GitHub: `https://github.com/Studio-Nullbyte/studio-nullbyte.github.io`
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add these secrets one by one:

**Secret 1:**
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://hfpmmjvdsdofheuffnwb.supabase.co`

**Secret 2:**
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcG1tanZkc2RvZmhldWZmbndiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI0MTA5NywiZXhwIjoyMDY3ODE3MDk3fQ.TLsJBj7YXSgJRLnALJs3_YEqYkY0KMFK51c4Ge1OKyw`

### 2. Enable GitHub Pages

1. In your repository, go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

### 3. Deploy Your Site

1. **Commit and Push** your current changes:
   ```bash
   git add .
   git commit -m "Add Supabase integration and deployment configuration"
   git push origin main
   ```

2. **Monitor Deployment**:
   - Go to **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow run
   - Green checkmark = successful deployment
   - Red X = failed deployment (check logs)

### 4. Update Supabase Settings

Once deployed, update your Supabase project settings:

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Update these settings:
   - **Site URL**: `https://studio-nullbyte.github.io/studio-nullbyte.github.io/`
   - **Redirect URLs**: Add the same URL

## 🔍 Verification Steps

### Check if Supabase is Connected:

1. **Visit your live site**: `https://studio-nullbyte.github.io/studio-nullbyte.github.io/`
2. **Open Browser Console** (F12)
3. **Go to Contact page** and try submitting the form
4. **Check for errors**:
   - ✅ **Success**: Form submits without console errors
   - ❌ **Failure**: Console shows "Missing Supabase environment variables"

### Test Supabase Connection:

1. **Submit Contact Form** on your live site
2. **Check Supabase Dashboard**:
   - Go to **Table Editor** → **contact_submissions**
   - New submissions should appear

## 🚨 Troubleshooting

### Common Issues:

#### **Issue 1: "Missing Supabase environment variables"**
```
Error: Missing Supabase environment variables
```
**Solution**: 
- Verify GitHub Secrets are set correctly
- Check secret names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Redeploy by pushing a new commit

#### **Issue 2: Build fails with environment variables**
```
Error: Cannot read properties of undefined
```
**Solution**:
- Ensure GitHub Secrets are available to the workflow
- Check the deployment logs in Actions tab
- Verify secret values don't have extra spaces

#### **Issue 3: Supabase authentication fails**
```
Error: Invalid JWT
```
**Solution**:
- Update Site URL in Supabase dashboard to your GitHub Pages URL
- Add redirect URLs for your domain
- Check that you're using the anon key, not service role key

#### **Issue 4: CORS errors**
```
Access to fetch at 'https://...supabase.co' has been blocked by CORS policy
```
**Solution**:
- Update allowed origins in Supabase dashboard
- Ensure your GitHub Pages URL is whitelisted

## 📋 Current Configuration Status

### ✅ **Already Configured:**
- GitHub Actions workflow with environment variables
- Supabase client with proper error handling
- Environment variables template
- Build process includes Supabase bundle

### ⚠️ **Needs Your Action:**
- [ ] Add GitHub Secrets for Supabase credentials
- [ ] Update Supabase Site URL to GitHub Pages domain
- [ ] Push changes to trigger deployment
- [ ] Test live site functionality

## 🔄 Development vs Production

### Local Development:
- Uses `.env.local` file with your credentials
- Direct connection to Supabase
- Real-time development and testing

### Production (GitHub Pages):
- Uses GitHub Secrets for security
- Environment variables injected at build time
- Same Supabase project, production-ready

## 🔧 Manual Testing

If you want to test the build with environment variables locally:

```bash
# Set environment variables and build
VITE_SUPABASE_URL=https://hfpmmjvdsdofheuffnwb.supabase.co \
VITE_SUPABASE_ANON_KEY=your-anon-key \
npm run build

# Preview the production build
npm run preview
```

## 🎯 Next Steps

1. **Add the GitHub Secrets** (most important!)
2. **Push your changes** to trigger deployment
3. **Update Supabase settings** with your GitHub Pages URL
4. **Test the live site** functionality
5. **Monitor the database** for contact form submissions

Once you complete these steps, your Studio Nullbyte site will be fully deployed with Supabase backend functionality! 🚀
