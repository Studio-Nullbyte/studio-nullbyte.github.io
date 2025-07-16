# GitHub Repository Secrets Setup Guide

## 📋 **Step-by-Step Setup**

### 1. **Navigate to Repository Settings**
1. Go to your GitHub repository: `https://github.com/Studio-Nullbyte/studio-nullbyte.github.io`
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### 2. **Add Repository Secrets**
Click **New repository secret** for each of the following:

#### **Supabase Configuration**
```
Name: VITE_SUPABASE_URL
Value: your_supabase_project_url_here
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: your_supabase_anon_key_here
```

#### **Stripe Configuration**
```
Name: VITE_STRIPE_PUBLISHABLE_KEY
Value: pk_live_51RlCWuP59y3jEuN3gIe4hsjMbigZtdb9iIGCO7jk5a0O9lNFYRl5iJTlJTOZseBW8KPWTEmQh6ApI2y9gcno10A800CSEfdgPo
```

#### **Crisp Chat Configuration**
```
Name: VITE_CRISP_WEBSITE_ID
Value: edecbf12-1559-474c-9d81-6915a18cf171
```

#### **EmailJS Configuration**
```
Name: VITE_EMAILJS_SERVICE_ID
Value: service_uiopigv
```

```
Name: VITE_EMAILJS_TEMPLATE_ID
Value: template_t37v8ek
```

```
Name: VITE_EMAILJS_PUBLIC_KEY
Value: 8v-_cpdn0TjBj35YF
```

#### **PayPal Configuration**
```
Name: VITE_PAYPAL_CLIENT_ID
Value: AcG5qPSjS9Mm6BnqfbNCdl5uUFD9NsQUreAbZZCpfS2EDP_MiNE1j_yIIRbDb-tZMi21_HT29bMBHJDP
```

```
Name: VITE_PAYPAL_API_BASE
Value: https://api.paypal.com
```

#### **Square Configuration**
```
Name: VITE_SQUARE_APPLICATION_ID
Value: sq0idp-Y12sAu8fu2t-3uP9HwXk-A
```

```
Name: VITE_SQUARE_LOCATION_ID
Value: L6QRE56637GZ2
```

```
Name: VITE_SQUARE_ENVIRONMENT
Value: production
```

## 🔒 **Security Best Practices**

### **✅ Safe for Repository Secrets:**
- **Stripe Publishable Key**: Designed for client-side use
- **PayPal Client ID**: Public identifier for client-side
- **Square Application ID**: Public identifier for client-side
- **Crisp Website ID**: Public website identifier
- **EmailJS IDs**: Public service identifiers

### **⚠️ Keep These Private:**
- Never commit secret/private keys to the repository
- Use GitHub Secrets for all sensitive configuration
- Regularly rotate API keys when possible

## 🚀 **Deployment Process**

Once secrets are set up:

1. **Push to main branch** triggers automatic deployment
2. **GitHub Actions** builds the site with secrets injected
3. **GitHub Pages** serves the built static files
4. **Environment variables** are baked into the build (client-side accessible)

## 📝 **Important Notes**

### **Client-Side Visibility:**
- All `VITE_*` variables become visible in the browser
- This is normal and expected for client-side configuration
- Never use server-side/private keys in `VITE_*` variables

### **Environment Differences:**
- **Local Development**: Uses `.env` file
- **GitHub Pages**: Uses GitHub Secrets
- **Production**: All variables are compiled into JavaScript

### **Verification:**
After deployment, you can verify by:
1. Opening browser dev tools on your live site
2. Checking that payment integrations work
3. Confirming API calls are made with correct credentials

## 🔧 **Troubleshooting**

### **Build Fails:**
- Check that all required secrets are set
- Verify secret names match exactly (case-sensitive)
- Ensure no typos in secret values

### **Payment Not Working:**
- Verify API keys are for correct environment (sandbox vs production)
- Check browser console for error messages
- Confirm payment provider settings allow your domain

### **Missing Variables:**
- Add any missing secrets to repository settings
- Re-run the deployment workflow
- Check GitHub Actions logs for specific errors

---

**Next Steps:**
1. Add all secrets to your GitHub repository
2. Push any changes to trigger deployment
3. Test the live site to confirm everything works
4. Monitor GitHub Actions for any build errors
