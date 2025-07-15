# Stripe Payment Integration - Quick Setup Guide

## Overview

Stripe has been successfully added back as a payment option in your checkout. This uses a **demo mode** that's perfect for development and testing.

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

The required Stripe packages have been added:
- `@stripe/react-stripe-js`
- `@stripe/stripe-js`

### 2. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Stripe publishable key:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

### 3. Get Your Stripe Key

1. Go to [https://stripe.com](https://stripe.com) and create a free account
2. Navigate to **Developers > API keys** 
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Add it to your `.env` file

### 4. Start Development

```bash
npm run dev
```

## Features

✅ **Real Stripe Elements** - Secure card input with validation  
✅ **Demo Mode** - Simulates payments without real charges  
✅ **Test Cards** - Use Stripe test cards for testing  
✅ **Recommended Badge** - Stripe is marked as the preferred option  
✅ **Error Handling** - Realistic success/failure scenarios  

## Test Cards

Use these Stripe test card numbers:

### Successful Payments
- **Visa**: `4242424242424242`
- **Mastercard**: `5555555555554444`
- **American Express**: `378282246310005`

### Failed Payments
- **Declined**: `4000000000000002`
- **Insufficient Funds**: `4000000000000009`

### Test Data
- **Expiry**: Any future date (e.g., `12/25`)
- **CVV**: Any 3-digit number (e.g., `123`)

## Payment Options

Your checkout now offers:

1. **💳 Credit/Debit Card** (Stripe) - Recommended, pre-selected
2. **🟦 PayPal** - Alternative option
3. **⬛ Square** - Additional alternative

## How Demo Mode Works

- Uses real Stripe Elements for card validation
- Simulates payment processing locally (95% success rate)
- No real charges are made to test cards
- Perfect for development and testing

## Production Upgrade

When ready for live payments:

1. **Backend API** - Add server-side payment intent creation
2. **Webhook Handling** - Process payment confirmations
3. **Live Keys** - Switch to live Stripe keys (`pk_live_...`)
4. **Real Processing** - Replace simulation with actual Stripe API calls

## Support

- [Stripe Testing Cards](https://stripe.com/docs/testing#cards)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [React Stripe.js Docs](https://stripe.com/docs/stripe-js/react)

Your Stripe integration is now ready for testing! 🎉
