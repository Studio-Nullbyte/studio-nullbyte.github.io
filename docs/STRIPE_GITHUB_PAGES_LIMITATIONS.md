# ⚠️ GitHub Pages Stripe Limitations & Solutions

## 🚨 **Current Issue**

```
invalid stripe.redirectToCheckout parameter: lineItems[0].price_data
```

## 🔍 **Root Cause**

GitHub Pages only supports **static file hosting**. Stripe's `redirectToCheckout` method has two modes:

1. **Dynamic Pricing** (requires server) ❌ Not supported on GitHub Pages
2. **Pre-created Prices** (static Price IDs) ✅ Works on GitHub Pages

## 💡 **Solutions**

### Option 1: Use Pre-created Stripe Price IDs ✅ **Recommended**

Create Price objects in your Stripe Dashboard and reference them by ID.

#### Step 1: Create Prices in Stripe Dashboard

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Create a product for each template/service
3. Add prices to each product
4. Copy the Price IDs (format: `price_xxxxxxxxx`)

#### Step 2: Update Your Product Data

```typescript
// Example product configuration
const products = [
  {
    id: 'template-1',
    name: 'React Landing Page Template',
    price: 29.99,
    stripePriceId: 'price_1ABCDEFxxxxxxxxxxxxxx' // From Stripe Dashboard
  },
  {
    id: 'template-2', 
    name: 'Next.js Portfolio Template',
    price: 39.99,
    stripePriceId: 'price_1XYZABCxxxxxxxxxxxxxx' // From Stripe Dashboard
  }
]
```

#### Step 3: Use in Checkout

```typescript
<StripePayment
  product={{
    id: product.id,
    name: product.name,
    price: product.price,
    stripePriceId: product.stripePriceId // This enables GitHub Pages compatibility
  }}
  onSuccess={handleSuccess}
  onError={handleError}
/>
```

### Option 2: Deploy to Platform with Serverless Functions ✅ **Alternative**

Use a platform that supports serverless functions:

#### Vercel (Recommended)
```bash
npm i -g vercel
vercel deploy
```

#### Netlify
```bash
npm run build
# Deploy dist folder to Netlify
```

#### Railway/Render
Full Node.js hosting with Express server

### Option 3: Use Stripe Payment Links ✅ **Simplest**

Create Payment Links in Stripe Dashboard and redirect to them:

```typescript
const handlePayment = () => {
  // Redirect to Stripe Payment Link
  window.location.href = 'https://buy.stripe.com/your-payment-link'
}
```

## 🛠️ **Current Implementation**

Your code now:
- ✅ Checks for `stripePriceId` first
- ✅ Uses pre-created Price IDs when available  
- ✅ Shows helpful error message when Price ID missing
- ✅ Maintains GitHub Pages compatibility

## 🎯 **Recommended Next Steps**

### For GitHub Pages (Static):
1. **Create Price IDs** in Stripe Dashboard for each product
2. **Update product data** to include `stripePriceId` fields
3. **Test checkout** with pre-created prices

### For Dynamic Pricing:
1. **Deploy to Vercel** - keeps your current code working
2. **Use serverless functions** - enables dynamic pricing
3. **Better user experience** - no pre-configuration needed

## 📊 **Comparison**

| Feature | GitHub Pages | Vercel | Netlify |
|---------|-------------|--------|---------|
| Static hosting | ✅ | ✅ | ✅ |
| Serverless functions | ❌ | ✅ | ✅ |
| Dynamic pricing | ❌ | ✅ | ✅ |
| Custom domains | ✅ | ✅ | ✅ |
| Free tier | ✅ | ✅ | ✅ |

## 🔧 **Quick Fix for GitHub Pages**

To test immediately with a fixed price:

1. Create a test product in Stripe Dashboard
2. Copy the Price ID
3. Hardcode it in your checkout:

```typescript
stripePriceId: 'price_1ABCDEFGxxxxxxxxxxxxxx' // Your actual Price ID
```

This will enable immediate testing while you decide on your deployment strategy.

## 🚀 **Production Recommendation**

**Use Vercel** - It's free, supports your current code without changes, and provides the best developer experience for React applications with Stripe integration.
