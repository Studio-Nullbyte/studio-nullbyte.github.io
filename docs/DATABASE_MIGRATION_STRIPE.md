# Database Migration: Add Stripe Price ID to Products

## 🗄️ **Add stripe_price_id to products table**

### Option 1: Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Table Editor** > **products**
4. Click **+ Add Column**
5. Configure the new column:
   - **Name**: `stripe_price_id`
   - **Type**: `text`
   - **Default value**: `NULL`
   - **Allow nullable**: ✅ Yes (checked)
   - **Is unique**: ❌ No
6. Click **Save**

### Option 2: SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL command:

```sql
-- Add stripe_price_id column to products table
ALTER TABLE products 
ADD COLUMN stripe_price_id TEXT;

-- Add comment for documentation
COMMENT ON COLUMN products.stripe_price_id IS 'Stripe Price ID for GitHub Pages compatible checkout';
```

### Option 3: Local Development (if using Supabase CLI)

Create a new migration file:

```bash
# Create migration
supabase migration new add_stripe_price_id_to_products

# Add this SQL to the generated migration file:
```

```sql
-- Add stripe_price_id column to products table
ALTER TABLE products 
ADD COLUMN stripe_price_id TEXT;

-- Add comment for documentation  
COMMENT ON COLUMN products.stripe_price_id IS 'Stripe Price ID for GitHub Pages compatible checkout';
```

```bash
# Apply migration
supabase db push
```

## 🔄 **Update TypeScript Types**

After adding the column, update your database types:

```bash
# Regenerate types
npm run db:types
```

This will update `src/lib/types/database.ts` to include the new column.

## 📝 **Update Your Product Interface**

Update any TypeScript interfaces to include the new field:

```typescript
// In your product-related files
interface Product {
  id: string
  title: string
  description: string
  price: number
  category_id: string
  image_url: string | null
  download_url: string | null
  preview_url: string | null
  tags: string[]
  featured: boolean
  active: boolean
  stripe_price_id?: string | null  // Add this line
  created_at: string
  updated_at: string
}
```

## 🏷️ **Add Stripe Price IDs to Your Products**

1. **Create products in Stripe Dashboard**:
   - Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
   - Create products matching your database products
   - Copy the Price IDs (format: `price_xxxxxxxxx`)

2. **Update your database records**:
   
   **Option A: Via Supabase Dashboard**
   - Go to Table Editor > products
   - Edit each product row
   - Add the Stripe Price ID to the `stripe_price_id` column

   **Option B: Via SQL**
   ```sql
   -- Update products with their Stripe Price IDs
   UPDATE products 
   SET stripe_price_id = 'price_1ABCDEFxxxxxxxxx' 
   WHERE id = 'your-product-id-1';
   
   UPDATE products 
   SET stripe_price_id = 'price_1XYZABCxxxxxxxxx' 
   WHERE id = 'your-product-id-2';
   ```

## ✅ **Update Your Code**

After the database changes, update your checkout to use the database field:

```typescript
// In src/pages/Checkout.tsx, update the StripePayment component:
<StripePayment
  product={{
    id: `order-${Date.now()}`,
    name: `Studio Nullbyte Order (${items.length} item${items.length > 1 ? 's' : ''})`,
    price: total,
    description: items.map(item => `${item.title} ($${item.price.toFixed(2)})`).join(', '),
    image: items[0]?.image_url || undefined,
    stripePriceId: items[0]?.stripe_price_id || undefined // Use from database
  }}
  onSuccess={() => handlePaymentSuccess('stripe_checkout_session')}
  onError={handlePaymentError}
  disabled={!isFormValid()}
/>
```

## 🧪 **Test the Integration**

1. **Verify database update**: Check that the column exists
2. **Regenerate types**: Run `npm run db:types`
3. **Add Price IDs**: Update at least one product with a Stripe Price ID
4. **Test checkout**: Try purchasing that product

After these steps, your GitHub Pages Stripe integration will work! 🎉
