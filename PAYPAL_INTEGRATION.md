# PayPal Integration Guide

## Overview

This guide explains how to set up and use the PayPal payment integration in Studio Nullbyte.

## Prerequisites

1. **PayPal Developer Account**: Create an account at [developer.paypal.com](https://developer.paypal.com/)
2. **PayPal App**: Create a new app in your PayPal Developer Dashboard
3. **Client ID**: Get your sandbox and production client IDs

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @paypal/react-paypal-js
```

### 2. Environment Variables

Create a `.env` file in your project root:

```env
# PayPal Configuration
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# For sandbox testing
VITE_PAYPAL_CLIENT_ID=AYCjIMV9QoUyaOVsRjY9S6sJkZcQZxPUZjY_ZCCwLqLgOAcNlZGNCAqZzRSDYjS0qVWKwfJdJJJMJJJJ

# For production
VITE_PAYPAL_CLIENT_ID=your_live_paypal_client_id

# Optional: Custom return/cancel URLs (defaults to /success and /cancel)
VITE_PAYPAL_RETURN_URL=https://yourdomain.com/payment-success
VITE_PAYPAL_CANCEL_URL=https://yourdomain.com/payment-cancelled
```

### 3. PayPal App Configuration

In your PayPal Developer Dashboard:

1. Go to [developer.paypal.com](https://developer.paypal.com/)
2. Create a new app or select existing
3. Configure the following settings:
   - **Features**: Enable "Accept Payments"
   - **App Type**: Select "Merchant" 
   - **Platform**: Select "Web"

**Note**: Return URLs and Cancel URLs are configured in your application code, not in the PayPal Dashboard. They are set dynamically when creating orders (see the PayPal Payment Component section below).

### 4. Return and Cancel URLs

These URLs are configured in your code when creating PayPal orders:

```typescript
// In src/lib/paypal.ts
export const PAYPAL_RETURN_URL = import.meta.env.VITE_PAYPAL_RETURN_URL || `${window.location.origin}/success`
export const PAYPAL_CANCEL_URL = import.meta.env.VITE_PAYPAL_CANCEL_URL || `${window.location.origin}/cancel`

// Used in src/components/payments/PayPalPayment.tsx
application_context: {
  brand_name: 'Studio Nullbyte',
  locale: 'en_US',
  landing_page: 'BILLING',
  shipping_preference: 'NO_SHIPPING',
  user_action: 'PAY_NOW',
  return_url: PAYPAL_RETURN_URL,  // ← Return URL
  cancel_url: PAYPAL_CANCEL_URL   // ← Cancel URL
}
```

**Default behavior**: If you don't set environment variables, the URLs will automatically be:
- Return URL: `https://yourdomain.com/success`
- Cancel URL: `https://yourdomain.com/cancel`

**Custom URLs**: You can override these in your `.env` file:
```env
VITE_PAYPAL_RETURN_URL=https://yourdomain.com/payment-success
VITE_PAYPAL_CANCEL_URL=https://yourdomain.com/payment-cancelled
```

Make sure you have these routes set up in your application:
- `/success` - Where users go after successful payment
- `/cancel` - Where users go if they cancel payment

### 5. Webhook Configuration (Optional)

If you want to receive webhook notifications for payment events:

1. In your PayPal Developer Dashboard, go to your app settings
2. Click "Add Webhook"
3. Enter your webhook URL: `https://yourdomain.com/api/paypal/webhook`
4. Select the events you want to receive (e.g., "Payment capture completed")
5. Save the webhook and note the Webhook ID for signature validation

## Components

### PayPal Payment Component

The `PayPalPayment` component (`src/components/payments/PayPalPayment.tsx`) handles:

- PayPal SDK initialization
- Order creation
- Payment processing
- Error handling
- Loading states

### Usage Example

```tsx
import PayPalPayment from '../components/payments/PayPalPayment'

<PayPalPayment
  amount={totalAmount}
  onSuccess={(paymentId) => {
    console.log('Payment successful:', paymentId)
    // Handle successful payment
  }}
  onError={(error) => {
    console.error('Payment failed:', error)
    // Handle payment error
  }}
  disabled={!isFormValid()}
  customerInfo={customerInfo}
/>
```

## Backend Integration

### Order Creation

For production use, implement backend order creation:

```typescript
// Frontend: Create order
const createOrder = async (): Promise<string> => {
  const response = await fetch('/api/paypal/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: totalAmount,
      currency: 'USD',
      customerInfo,
      items: cartItems
    })
  })
  
  const { orderId } = await response.json()
  return orderId
}
```

### Payment Capture

```typescript
// Frontend: Capture payment
const onApprove = async (data: any) => {
  const response = await fetch(`/api/paypal/capture-order/${data.orderID}`, {
    method: 'POST'
  })
  
  const result = await response.json()
  if (result.success) {
    onSuccess(result.paymentId)
  }
}
```

### Backend Routes (Node.js/Express)

```javascript
const paypal = require('@paypal/checkout-server-sdk')

// Create order
app.post('/api/paypal/create-order', async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest()
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: req.body.amount.toFixed(2)
      }
    }]
  })
  
  const order = await client.execute(request)
  res.json({ orderId: order.result.id })
})

// Capture payment
app.post('/api/paypal/capture-order/:orderId', async (req, res) => {
  const request = new paypal.orders.OrdersCaptureRequest(req.params.orderId)
  const capture = await client.execute(request)
  
  res.json({
    success: true,
    paymentId: capture.result.id
  })
})
```

## Configuration Options

### PayPal SDK Options

```typescript
// src/lib/paypal.ts
export const PAYPAL_OPTIONS = {
  clientId: PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
  components: "buttons",
  "enable-funding": "venmo,paylater",
  "disable-funding": "card"
}
```

### Button Styling

```typescript
export const PAYPAL_STYLES = {
  layout: 'vertical' as const,
  color: 'gold' as const,
  shape: 'rect' as const,
  label: 'paypal' as const,
  height: 40
}
```

## Testing

### Sandbox Testing

1. Use sandbox client ID in development
2. Use PayPal sandbox accounts for testing
3. Test various payment scenarios:
   - Successful payments
   - Failed payments
   - Cancelled payments
   - Network errors

### Test Accounts

Create test accounts in PayPal Developer Dashboard:
- **Buyer Account**: For testing purchases
- **Seller Account**: For receiving payments

## Security Considerations

### Environment Variables

- Never expose client secrets in frontend code
- Use environment variables for configuration
- Different credentials for sandbox vs production

### HTTPS Required

PayPal requires HTTPS for production:
- Development: `http://localhost` is allowed
- Production: Must use `https://`

### Webhook Validation

Implement webhook signature validation:

```javascript
const crypto = require('crypto')

app.post('/api/paypal/webhook', (req, res) => {
  const webhookSignature = req.headers['paypal-transmission-sig']
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  
  // Verify webhook signature
  const isValid = validateWebhookSignature(req.body, webhookSignature, webhookId)
  
  if (isValid) {
    // Process webhook event
    res.status(200).send('OK')
  } else {
    res.status(400).send('Invalid signature')
  }
})
```

## Error Handling

### Common Errors

1. **Invalid Client ID**: Check environment variables
2. **Script Loading Failed**: Network issues or incorrect configuration
3. **Payment Declined**: Insufficient funds or card issues
4. **Order Creation Failed**: Backend API issues

### Error Recovery

```typescript
const onError = (error: any) => {
  console.error('PayPal error:', error)
  
  // Show user-friendly error message
  setErrorMessage('Payment failed. Please try again.')
  
  // Track error for analytics
  trackError('paypal_payment_failed', error)
}
```

## Production Deployment

### Checklist

- [ ] Replace sandbox client ID with production client ID
- [ ] Update webhook URLs to production endpoints
- [ ] Implement proper backend order creation and capture
- [ ] Set up webhook signature validation
- [ ] Configure proper error logging
- [ ] Test with real PayPal accounts
- [ ] Monitor payment success rates

### Environment Variables for Production

```env
VITE_PAYPAL_CLIENT_ID=your_production_client_id
VITE_PAYPAL_API_BASE=https://api.paypal.com
```

## Monitoring and Analytics

### Payment Tracking

```typescript
// Track successful payments
const onSuccess = (paymentId: string) => {
  analytics.track('payment_success', {
    payment_method: 'paypal',
    payment_id: paymentId,
    amount: totalAmount
  })
}

// Track failed payments
const onError = (error: string) => {
  analytics.track('payment_failed', {
    payment_method: 'paypal',
    error_message: error
  })
}
```

### PayPal Analytics

Use PayPal's built-in analytics:
- Transaction reports
- Payment success rates
- Customer behavior insights

## Support

### Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal React SDK](https://github.com/paypal/react-paypal-js)
- [PayPal REST API Reference](https://developer.paypal.com/docs/api/payments/v2/)

### Common Issues

1. **Button not appearing**: Check client ID and network connectivity
2. **Payment not processing**: Verify backend integration
3. **Webhook not receiving**: Check URL and signature validation

For support, contact the development team or check the PayPal Developer Community.
