# GitHub Pages Deployment Guide

## 🚀 Automated Deployment Setup

This repository is now configured with GitHub Actions to automatically deploy the Studio Nullbyte site to GitHub Pages whenever you push changes to the `main` branch.

## Prerequisites

Before the deployment works, you need to configure GitHub Pages in your repository settings:

### 1. Enable GitHub Pages
1. Go to your repository on GitHub: `https://github.com/Studio-Nullbyte/studio-nullbyte.github.io`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**

### 2. Repository Configuration
- **Repository Name**: `studio-nullbyte.github.io` ✅
- **Branch**: `main` ✅
- **Public Repository**: Required for GitHub Pages (unless you have GitHub Pro)

## Deployment Workflow

### Automatic Deployment
The site automatically deploys when:
- You push commits to the `main` branch
- The build completes successfully
- All tests pass

### Manual Deployment
You can also trigger deployment manually:
1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button

## File Structure Added

```
.github/
└── workflows/
    └── deploy.yml        # GitHub Actions workflow configuration
```

## Configuration Files Updated

### `vite.config.ts`
- Added `base` configuration for GitHub Pages subdirectory routing
- Ensures assets load correctly when deployed

### Workflow Features (`deploy.yml`)
- **Node.js 18**: Uses latest LTS version
- **Dependency Caching**: Speeds up builds
- **Build Verification**: Ensures successful build before deployment
- **Artifact Upload**: Uploads built site to GitHub Pages
- **Permissions**: Properly configured for GitHub Pages deployment

## Your Site URL

Once deployed, your site will be available at:
```
https://studio-nullbyte.github.io/studio-nullbyte.github.io/
```

## Build Process

The workflow performs these steps:
1. **Checkout Code**: Downloads your repository
2. **Setup Node.js**: Installs Node.js 18 with npm caching
3. **Install Dependencies**: Runs `npm ci` for clean installs
4. **Build Site**: Runs `npm run build` to create production bundle
5. **Deploy**: Uploads `dist/` folder to GitHub Pages

## Monitoring Deployments

### Check Deployment Status
1. Go to **Actions** tab in your repository
2. View the latest workflow run
3. Green checkmark = successful deployment
4. Red X = failed deployment (check logs)

### Troubleshooting
Common issues and solutions:

**Build Fails:**
- Check the Actions log for specific error messages
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally

**Site Not Loading:**
- Verify GitHub Pages is enabled in repository settings
- Check that the source is set to "GitHub Actions"
- Wait a few minutes for DNS propagation

**Assets Not Loading:**
- The `base` configuration in `vite.config.ts` handles this
- Ensure all asset paths are relative (no leading `/`)

## Development Workflow

### Local Development
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build locally
```

### Deployment Process
1. Make changes locally
2. Test with `npm run build` and `npm run preview`
3. Commit and push to `main` branch
4. GitHub Actions automatically deploys
5. Site updates in 2-5 minutes

## Security & Permissions

The workflow uses minimal permissions:
- `contents: read` - Read repository files
- `pages: write` - Deploy to GitHub Pages
- `id-token: write` - Authentication for deployment

## Performance Features

- **Dependency Caching**: npm packages cached between builds
- **Concurrent Control**: Prevents conflicting deployments
- **Source Maps**: Generated for debugging (can be disabled in production)
- **Asset Optimization**: Vite automatically optimizes CSS, JS, and images

## Custom Domain (Optional)

To use a custom domain like `studionullbyte.com`:

1. Add a `CNAME` file to the `public/` directory:
   ```
   studionullbyte.com
   ```

2. Configure DNS with your domain provider:
   ```
   CNAME record: www.studionullbyte.com → studio-nullbyte.github.io
   A records for apex domain:
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

3. Update `vite.config.ts` base path:
   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/' : '/',
   ```

## Next Steps

1. **Push this configuration** to your repository
2. **Enable GitHub Pages** in repository settings
3. **Make a test commit** to trigger your first deployment
4. **Monitor the Actions tab** to see the deployment progress
5. **Visit your live site** once deployment completes

Your Studio Nullbyte site will be live and automatically updated with every push! 🎉
