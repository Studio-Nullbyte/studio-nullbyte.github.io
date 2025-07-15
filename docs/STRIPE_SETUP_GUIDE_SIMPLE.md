# Stripe Setup Guide (Simplified Demo Mode)

## Overview

This guide covers setting up Stripe in **demo mode** - a simplified integration that doesn't require a backend server. Perfect for development and testing!

## Quick Setup

### 1. Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" to create an account
3. Complete the registration process
4. You'll be automatically in **Test Mode** (perfect for development)

### 2. Get Your Publishable Key

1. In your Stripe Dashboard, go to **Developers > API keys**
2. Copy the **Publishable key** (starts with `pk_test_`)
3. **Note**: You only need the publishable key for this demo mode

### 3. Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Stripe publishable key:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

### 4. Start Development

```bash
npm install
npm run dev
```

That's it! Your payment system is ready for testing.

## Demo Mode Features

✅ **Real Stripe Elements** - Secure card input fields  
✅ **Card Validation** - Real-time validation  
✅ **Test Cards** - Use Stripe's test card numbers  
✅ **Error Simulation** - Test different scenarios  
✅ **No Backend Required** - Simplified for development  

## Test Cards

Use these test card numbers:

### Successful Payments
- **Visa**: `4242424242424242`
- **Mastercard**: `5555555555554444`
- **American Express**: `378282246310005`

### Failed Payments
- **Generic decline**: `4000000000000002`
- **Insufficient funds**: `4000000000000009`

### Test Data
- **Expiry**: Any future date (e.g., `12/25`)
- **CVV**: Any 3-digit number (e.g., `123`)

## Production Upgrade

When ready for production, you'll need to:

1. **Add Backend API** - Create payment intents server-side
2. **Use Secret Key** - Add server-side Stripe integration
3. **Webhook Handling** - Process payment confirmations
4. **Live Mode** - Switch to live Stripe keys

For now, enjoy testing with the simplified demo mode! 🎉

## Support

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- Demo mode processes payments locally without hitting Stripe servers
