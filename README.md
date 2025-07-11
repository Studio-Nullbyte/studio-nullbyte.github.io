# Studio Nullbyte

> Modular tools for the design-minded developer. Clean. Branded. Ready to deploy.

## Overview

Studio Nullbyte is a multi-page React + Tailwind CSS website for selling digital templates and tools. Built with a dark, code-glitch aesthetic and hacker vibe, it serves as both an informational site and digital product marketplace.

## Features

- **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Dark Theme**: Code-glitch aesthetic with electric violet accents
- **Responsive Design**: Mobile-first approach with fluid layouts
- **SEO Optimized**: Helmet for meta tags and structured data
- **Performance**: Optimized for fast loading and smooth animations
- **Accessibility**: WCAG AA compliant design
- **Backend Integration**: Supabase for authentication and data storage
- **Contact Form**: Real-time submissions with database storage
- **User Authentication**: Registration, login, and profile management
- **Database**: PostgreSQL with Row Level Security policies

## Target Audience

- Freelancers leveling up their brand
- Indie developers launching microproducts
- AI creators and prompt engineers
- Small business owners seeking plug-and-play visuals
- Marketing agencies outsourcing assets

## Product Categories

- Web Templates (React, Next.js, etc.)
- Notion Templates
- Document Templates
- AI Prompts
- UI Components

## Design System

### Colors
- **Primary**: Electric Violet (#8B5CF6)
- **Background**: Black (#000000)
- **Text**: White (#FFFFFF)
- **Code Gray**: #1E1E1E
- **Terminal Green**: #00FF41

### Typography
- **Primary**: IBM Plex Mono
- **Fallbacks**: JetBrains Mono, Söhne Mono, Courier New

### Animations
- Blinking cursor effects
- Glitch text hover states
- Smooth page transitions
- Scroll-triggered animations

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/studio-nullbyte/studio-nullbyte.github.io.git

# Navigate to project directory
cd studio-nullbyte.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   └── Footer.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── Product.tsx
│   ├── About.tsx
│   └── Contact.tsx
├── hooks/              # Custom React hooks
│   ├── useScrollToTop.ts
│   └── useIntersectionObserver.ts
├── index.css           # Global styles and Tailwind utilities
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Key Pages

### Home
- Hero section with animated tagline
- Featured products showcase
- Company values and statistics
- Call-to-action sections

### Products
- Filterable product catalog
- Search functionality
- Category-based filtering
- Product cards with ratings and downloads

### Product Detail
- Comprehensive product information
- Image gallery
- Feature lists and specifications
- Purchase integration ready

### About
- Company mission and values
- Team member profiles
- Statistics and achievements
- Community focus

### Contact
- Contact form with validation
- Multiple contact methods
- FAQ section
- Terminal-style CTA

## Customization

### Branding
- Update logo placeholder in `Header.tsx`
- Modify color scheme in `tailwind.config.js`
- Update contact information throughout

### Content
- Edit product data in respective components
- Update company information in About page
- Modify FAQ content in Contact page

### Styling
- Customize animations in `index.css`
- Adjust component styles using Tailwind classes
- Modify theme colors and fonts

## Performance Optimizations

- Lazy loading for images
- Code splitting with React.lazy
- Optimized bundle size
- Efficient re-renders with React.memo

## SEO Features

- Dynamic meta tags with React Helmet
- Structured data markup
- Semantic HTML5 structure
- Optimized images and assets

## Deployment

### GitHub Pages (Automated)
This site is configured for automatic deployment to GitHub Pages using GitHub Actions.

- **Live Site**: https://studio-nullbyte.github.io/studio-nullbyte.github.io/
- **Auto-Deploy**: Pushes to `main` branch trigger automatic builds
- **Build Status**: Check the Actions tab for deployment status

See [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) for detailed setup instructions.

### Vercel
```bash
# Connect GitHub repository to Vercel
# Auto-deploy on push to main branch
```

### Netlify
```bash
# Connect GitHub repository to Netlify
# Build command: npm run build
# Publish directory: dist
```

## Backend & Database

### Supabase Integration
Studio Nullbyte uses Supabase for backend services:

- **Authentication**: User registration, login, and session management
- **Database**: PostgreSQL with real-time capabilities
- **Storage**: File uploads and asset management
- **API**: Auto-generated RESTful API with Row Level Security

### Database Schema
- **Products**: Digital templates and tools catalog
- **Categories**: Product organization (Web, Notion, AI, etc.)
- **Users**: Profile management and authentication
- **Downloads**: Purchase and download tracking
- **Reviews**: Product ratings and feedback
- **Contact**: Form submissions and support

See [SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) for complete setup instructions.

## 🚀 Deployment

This site is configured for automatic deployment to GitHub Pages with Supabase backend.

### Prerequisites
1. GitHub repository with Pages enabled
2. Supabase project configured
3. GitHub Secrets configured with Supabase credentials

### Quick Deploy
1. Add GitHub Secrets:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
2. Push to main branch
3. GitHub Actions will automatically build and deploy

### Detailed Instructions
See [DEPLOYMENT_WITH_SUPABASE.md](./docs/DEPLOYMENT_WITH_SUPABASE.md) for step-by-step deployment guide.

**⚠️ Important**: The site will **NOT** connect to Supabase automatically without proper GitHub Secrets configuration.

## Contact

For questions or support, contact us at:
- Email: studionullbyte@gmail.com
- Website: https://studio-nullbyte.github.io

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Built with ☕ and code by Studio Nullbyte*