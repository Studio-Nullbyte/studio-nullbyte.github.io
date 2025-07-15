# 📧 EmailJS Setup for Automated Product Delivery

## 🎯 **Overview**

Your Studio Nullbyte site now has **automated email delivery** for digital products! When customers complete a purchase, they automatically receive:

- ✅ **Order confirmation email**
- ✅ **Download links** for their products
- ✅ **Professional branded emails**
- ✅ **Instant delivery** after payment

## 🚀 **Setup Steps (10 minutes)**

### 1. Create EmailJS Account

1. Go to [emailjs.com](https://www.emailjs.com/)
2. Click **"Sign Up"** (free account)
3. Verify your email address
4. Login to EmailJS Dashboard

### 2. Configure Email Service

#### Add Email Service:
1. In EmailJS Dashboard, click **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - **Outlook/Hotmail**
   - **Custom SMTP** (for business emails)

4. **For Gmail**:
   - Click **"Gmail"**
   - Authorize your Gmail account
   - Your **Service ID** will be generated (save this!)

#### Alternative - Custom SMTP:
If you want to use your business email (studionullbyte@gmail.com):
1. Choose **"Custom SMTP"**
2. Configure settings:
   - **SMTP Server**: smtp.gmail.com
   - **Port**: 587
   - **Username**: studionullbyte@gmail.com
   - **Password**: Your app password (see Gmail setup below)

### 3. Create Email Template

1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. **Template ID** will be generated (save this!)
4. Use this template content:

#### Template Subject:
```
Your Studio Nullbyte Order - Download Ready! (Order #{{order_number}})
```

#### Template Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Courier New', monospace; background: #000; color: #fff; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { border-bottom: 2px solid #8B5CF6; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { color: #8B5CF6; font-size: 24px; font-weight: bold; }
        .order-details { background: #1E1E1E; padding: 20px; margin: 20px 0; border: 1px solid #333; }
        .download-btn { background: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; display: inline-block; margin: 20px 0; border-radius: 4px; }
        .footer { border-top: 1px solid #333; padding-top: 20px; margin-top: 30px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Studio Nullbyte</div>
            <p>Modular tools for the design-minded developer</p>
        </div>

        <h1>Thanks for your order, {{customer_name}}!</h1>
        
        <p>Your payment has been processed and your digital product is ready for download.</p>

        <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> {{order_number}}</p>
            <p><strong>Product:</strong> {{product_name}}</p>
            <p><strong>Amount:</strong> {{product_price}}</p>
            <p><strong>Date:</strong> {{purchase_date}}</p>
        </div>

        <h2>Download Your Product</h2>
        <p>Click the button below to download your files:</p>
        
        <a href="{{download_link}}" class="download-btn">Download Now</a>
        
        <p><em>Download link: {{download_link}}</em></p>

        <h3>Need Help?</h3>
        <p>If you have any issues with your download, please contact us:</p>
        <ul>
            <li>Email: {{support_email}}</li>
            <li>Website: {{website_url}}</li>
        </ul>

        <div class="footer">
            <p>This email was sent because you completed a purchase at Studio Nullbyte.</p>
            <p>© 2025 Studio Nullbyte. Built with ☕ and code.</p>
        </div>
    </div>
</body>
</html>
```

### 4. Get Your Keys

After setting up service and template:

1. **Service ID**: Found in Email Services section
2. **Template ID**: Found in Email Templates section  
3. **Public Key**: Go to **"Account"** → **"API Keys"** → Copy Public Key

### 5. Add Environment Variables

#### Local Development (.env):
```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

#### GitHub Secrets:
Add these to your repository secrets:

1. **VITE_EMAILJS_SERVICE_ID**: Your service ID
2. **VITE_EMAILJS_TEMPLATE_ID**: Your template ID  
3. **VITE_EMAILJS_PUBLIC_KEY**: Your public key

### 6. Gmail App Password Setup

If using Gmail, you need an App Password:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **"App passwords"**
4. Generate password for **"Mail"**
5. Use this password in EmailJS SMTP settings

## 🎨 **How It Works**

### Purchase Flow:
1. **Customer pays** → Stripe processes payment
2. **Success page loads** → Triggers order processing
3. **Order saved** → Database record created
4. **Email sent** → Download links delivered instantly
5. **Customer downloads** → Gets their files immediately

### Email Features:
- ✅ **Professional branding** with Studio Nullbyte theme
- ✅ **Order details** included (number, product, price)
- ✅ **Direct download links** for instant access
- ✅ **Support contact info** for help
- ✅ **Mobile-friendly** HTML design

## 📊 **EmailJS Pricing**

- **Free Tier**: 200 emails/month
- **Personal**: $5/month - 1,000 emails
- **Pro**: $15/month - 10,000 emails

The free tier is perfect to start!

## 🔧 **Database Setup**

Make sure your products table has download links:

```sql
-- Add download_link column if not exists
ALTER TABLE products ADD COLUMN download_link TEXT;

-- Update products with download URLs
UPDATE products SET download_link = 'https://your-download-server.com/files/product1.zip' WHERE id = 'product-1';
```

## 🎯 **Testing**

### Test the Email System:
1. **Start dev server**: `npm run dev`
2. **Complete a test purchase** with Stripe test card: `4242 4242 4242 4242`
3. **Check console** for email sending logs
4. **Verify email** arrives in your inbox

### Troubleshooting:
- **Check EmailJS dashboard** for send logs
- **Verify all environment variables** are set
- **Test with different email addresses**
- **Check spam folder** for test emails

## 🔐 **Security**

- ✅ **Public keys only** - No sensitive data exposed
- ✅ **Template-based** - Prevents email injection
- ✅ **Rate limited** - EmailJS prevents abuse
- ✅ **No server required** - Works with GitHub Pages

## 🚀 **Production Deployment**

1. **Add GitHub Secrets** with your EmailJS credentials
2. **Test locally** first with real email addresses
3. **Deploy to GitHub Pages**
4. **Complete test purchase** on live site
5. **Verify emails** are working in production

Your customers will now receive professional download emails instantly after purchase! 🎉

## 🆘 **Support**

- **EmailJS Docs**: [docs.emailjs.com](https://www.emailjs.com/docs/)
- **Gmail Setup**: [support.google.com](https://support.google.com/mail/answer/185833)
- **Template Editor**: Built into EmailJS dashboard
