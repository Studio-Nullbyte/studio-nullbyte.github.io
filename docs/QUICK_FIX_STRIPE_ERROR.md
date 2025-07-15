# 🚨 Quick Fix: "Server-side integration required" Error

## ⚡ **Immediate Solutions**

### Option 1: Deploy to Vercel (2 minutes) ✅ **Recommended**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Add environment variables in Vercel dashboard:
# VITE_STRIPE_PUBLISHABLE_KEY = your publishable key
# STRIPE_SECRET_KEY = your secret key
```

**Result**: Dynamic pricing works immediately, no code changes needed.

### Option 2: Add Stripe Price IDs (5 minutes)

1. **Create a product** in [Stripe Dashboard](https://dashboard.stripe.com/products)
2. **Copy the Price ID** (starts with `price_`)
3. **Update your checkout code**:

```typescript
// In src/pages/Checkout.tsx, find the StripePayment component and update:
<StripePayment
  product={{
    id: `order-${Date.now()}`,
    name: `Studio Nullbyte Order (${items.length} item${items.length > 1 ? 's' : ''})`,
    price: total,
    description: items.map(item => `${item.title} ($${item.price.toFixed(2)})`).join(', '),
    image: items[0]?.image_url || undefined,
    stripePriceId: "price_1ABCDEFxxxxxxxxxxxxxxx" // Replace with your actual Price ID
  }}
  onSuccess={() => handlePaymentSuccess('stripe_checkout_session')}
  onError={handlePaymentError}
  disabled={!isFormValid()}
/>
```

**Result**: Works on GitHub Pages with fixed pricing.

## 🎯 **Current Problem**

The error occurs because:
- ✅ Code is ready for GitHub Pages
- ❌ Missing Stripe Price IDs for static hosting
- ❌ OR missing server for dynamic pricing

## 💡 **Why This Happened**

GitHub Pages = **Static hosting only**
- ✅ Can use pre-created Stripe Price IDs  
- ❌ Cannot create prices dynamically

Your code now supports both approaches - you just need to choose one!

## 🚀 **Recommendation**

**Use Vercel** - it's free, supports your current code without any changes, and gives you the full dynamic pricing functionality you had before.

```bash
vercel deploy
```

That's it! Your site will work exactly as expected. 🎉
