# Square Payment Integration Guide

## Overview

This guide walks you through integrating Square payment processing into your Studio Nullbyte website. Square provides a secure, PCI-compliant payment system with real-time card processing.

## Prerequisites

1. **Square Developer Account**: Sign up at [developer.squareup.com](https://developer.squareup.com/)
2. **Square Application**: Create a new application in your Square Developer Dashboard
3. **Location ID**: Get your location ID from the Square Dashboard

## Square Dashboard Setup

### 1. Create a Square Application

1. Log in to your Square Developer Dashboard
2. Click "Create Application"
3. Choose "Payment API" as the primary API
4. Fill in your application details:
   - **Application Name**: Studio Nullbyte Website
   - **Description**: Payment processing for digital template sales
   - **Website URL**: https://studio-nullbyte.github.io

### 2. Get Required Credentials

From your Square application dashboard, you'll need:

- **Application ID**: Found in "Credentials" tab
- **Location ID**: Found in "Locations" tab
- **Environment**: Choose "Sandbox" for testing, "Production" for live

### 3. Configure Web SDK

1. In your application settings, enable "Web Payments SDK"
2. Add your domain to the "Allowed Origins" list:
   - For local development: `http://localhost:5173`
   - For production: `https://studio-nullbyte.github.io`

## Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.template .env.local
```

### 2. Configure Square Variables

Edit `.env.local` and add your Square credentials:

```bash
# Square Configuration
VITE_SQUARE_APPLICATION_ID=your_square_application_id_here
VITE_SQUARE_LOCATION_ID=your_square_location_id_here
VITE_SQUARE_ENVIRONMENT=sandbox

# For sandbox testing
VITE_SQUARE_APPLICATION_ID=sandbox-sq0idb-_your_app_id_here
VITE_SQUARE_LOCATION_ID=LQZX7XPQZX7XP
VITE_SQUARE_ENVIRONMENT=sandbox

# For production
VITE_SQUARE_APPLICATION_ID=sq0idp-_your_production_app_id
VITE_SQUARE_LOCATION_ID=your_production_location_id
VITE_SQUARE_ENVIRONMENT=production
```

## Implementation Details

### 1. Square Web SDK Integration

The Square payment component uses the Web SDK for secure card processing:

```typescript
// Square Web SDK is loaded dynamically
const script = document.createElement('script')
script.src = 'https://web.squarecdn.com/v1/square.js'
```

### 2. Payment Flow

1. **SDK Loading**: Square Web SDK loads asynchronously
2. **Card Initialization**: Creates secure card input fields
3. **Tokenization**: Converts card data to secure tokens
4. **Payment Processing**: Sends tokens to backend for processing

### 3. Security Features

- **PCI Compliance**: Square handles all sensitive card data
- **Tokenization**: Card numbers never touch your servers
- **Encryption**: All data encrypted in transit and at rest
- **Fraud Protection**: Built-in fraud detection and prevention

## Testing

### 1. Test Card Numbers

Square provides test card numbers for sandbox testing:

```
Visa: 4111 1111 1111 1111
Mastercard: 5555 5555 5555 4444
American Express: 3782 822463 10005
Discover: 6011 1111 1111 1117

CVV: Any 3-4 digit number
Expiry: Any future date
```

### 2. Test Scenarios

- **Successful Payment**: Use test card numbers above
- **Declined Payment**: Use card number `4000 0000 0000 0002`
- **Insufficient Funds**: Use card number `4000 0000 0000 9995`
- **Invalid Card**: Use card number `4000 0000 0000 0127`

## Production Deployment

### 1. Switch to Production

1. Update environment variables:
   ```bash
   VITE_SQUARE_ENVIRONMENT=production
   VITE_SQUARE_APPLICATION_ID=your_production_app_id
   VITE_SQUARE_LOCATION_ID=your_production_location_id
   ```

2. Update Square application settings:
   - Add production domain to "Allowed Origins"
   - Enable production mode in Square Dashboard

### 2. SSL Requirements

Square requires HTTPS for production:
- Local development: Not required
- Production: Must use HTTPS

## Backend Integration

### 1. Payment Processing

The frontend tokenizes cards and sends tokens to your backend:

```typescript
// Frontend sends this to your backend
const paymentRequest = {
  sourceId: tokenResult.token,
  amount: Math.round(amount * 100), // Convert to cents
  currency: 'USD',
  locationId: SQUARE_WEB_SDK_CONFIG.locationId,
  referenceId: `studio-nullbyte-${Date.now()}`,
  note: 'Studio Nullbyte digital template purchase',
  buyerEmailAddress: customerInfo?.email
}
```

### 2. Backend Implementation

Your backend should:
1. Receive the payment token
2. Create a payment using Square's Payments API
3. Handle webhooks for payment status updates
4. Deliver digital products on successful payment

## Error Handling

### 1. Common Errors

- **SDK Loading Failed**: Check internet connection and domain configuration
- **Invalid Card**: Use proper test card numbers
- **Network Error**: Check API credentials and network connectivity
- **Tokenization Failed**: Verify card details and try again

### 2. Error Messages

The component provides user-friendly error messages:
- Card validation errors
- Network connectivity issues
- Payment processing failures
- SDK initialization problems

## Customization

### 1. Styling

Card input fields can be customized via `SQUARE_CARD_STYLES`:

```typescript
export const SQUARE_CARD_STYLES = {
  '.input-container': {
    borderColor: '#374151',
    borderRadius: '4px',
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
    fontFamily: 'JetBrains Mono, monospace'
  }
}
```

### 2. Payment Button

The payment button follows Studio Nullbyte's design system:
- Electric violet color scheme
- Monospace font family
- Processing animations
- Disabled states

## Webhooks (Optional)

### 1. Payment Status Updates

Configure webhooks in Square Dashboard to receive payment status updates:

```
Webhook URL: https://your-backend.com/webhooks/square
Events: payment.created, payment.updated
```

### 2. Webhook Verification

Verify webhook signatures to ensure they're from Square:

```typescript
const signature = req.headers['x-square-signature']
const body = JSON.stringify(req.body)
const isValid = verifySignature(body, signature, webhookSecret)
```

## Support

### 1. Square Documentation

- [Square Developer Docs](https://developer.squareup.com/docs)
- [Web Payments SDK](https://developer.squareup.com/docs/web-payments/overview)
- [Payment API Reference](https://developer.squareup.com/reference/square/payments-api)

### 2. Troubleshooting

- Check browser console for errors
- Verify environment variables are set
- Ensure Square application is properly configured
- Test with different card numbers
- Check network connectivity

---

**Note**: This is a frontend implementation. For production use, you'll need a backend service to process the payment tokens and handle the actual payment processing with Square's API.

**Security**: Never store card details or payment tokens in your frontend application. Always send tokens directly to your secure backend for processing.
