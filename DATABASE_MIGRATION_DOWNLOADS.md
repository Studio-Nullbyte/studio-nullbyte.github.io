# Database Migration: Add Download Links to Products

## 🎯 **Add download_link Column for Email Delivery**

### Step 1: Add Column to Products Table

Execute this SQL in your **Supabase SQL Editor**:

```sql
-- Add download_link column to products table
ALTER TABLE products 
ADD COLUMN download_link TEXT,
ADD COLUMN file_url TEXT,
ADD COLUMN file_size INTEGER,
ADD COLUMN file_type TEXT;

-- Add comments for documentation
COMMENT ON COLUMN products.download_link IS 'Direct download URL for purchased products';
COMMENT ON COLUMN products.file_url IS 'Alternative file URL (fallback)';
COMMENT ON COLUMN products.file_size IS 'File size in bytes';
COMMENT ON COLUMN products.file_type IS 'File type/extension (zip, pdf, etc.)';
```

### Step 2: Update Existing Products

Add download links for your existing products:

```sql
-- Example product updates - replace with your actual products
UPDATE products SET 
  download_link = 'https://your-file-storage.com/react-template.zip',
  file_size = 2048000, -- 2MB in bytes
  file_type = 'zip'
WHERE title = 'React Landing Page Template';

UPDATE products SET 
  download_link = 'https://your-file-storage.com/vue-template.zip',
  file_size = 1536000, -- 1.5MB in bytes  
  file_type = 'zip'
WHERE title = 'Vue.js Portfolio Template';

UPDATE products SET 
  download_link = 'https://your-file-storage.com/notion-template.zip',
  file_size = 512000, -- 500KB in bytes
  file_type = 'zip' 
WHERE title = 'Notion Productivity Template';
```

### Step 3: Verify the Migration

Check that columns were added correctly:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('download_link', 'file_url', 'file_size', 'file_type');
```

View products with download links:

```sql
SELECT id, title, price, download_link, file_type, file_size
FROM products 
WHERE download_link IS NOT NULL;
```

## 📁 **File Storage Options**

### Option 1: GitHub Releases (Free)
1. Create releases in your repository
2. Upload product files as release assets
3. Use direct GitHub URLs as download links

Example URL format:
```
https://github.com/Studio-Nullbyte/studio-nullbyte.github.io/releases/download/v1.0/react-template.zip
```

### Option 2: Supabase Storage
1. Go to Supabase Dashboard → Storage
2. Create a "products" bucket  
3. Upload your files
4. Get public URLs for download links

### Option 3: Cloud Storage
- **Google Drive** (with direct download links)
- **Dropbox** (with direct download links)
- **AWS S3** (with presigned URLs)
- **Cloudflare R2** (cost-effective option)

## 🔐 **Security Considerations**

### Public vs Protected Downloads

#### Public Downloads (Simple):
```sql
-- Direct public URLs - anyone with link can download
UPDATE products SET download_link = 'https://public-storage.com/file.zip';
```

#### Protected Downloads (Advanced):
```sql
-- Temporary/signed URLs - requires server-side generation
UPDATE products SET download_link = 'https://api.studio-nullbyte.com/download/{product_id}';
```

### Preventing Direct Access
- Use **temporary download URLs** that expire
- **Check purchase status** before allowing download
- **Log download attempts** for abuse prevention

## 🚀 **Email Integration**

After migration, emails will automatically include:
- ✅ **Direct download links** from `download_link` column
- ✅ **Fallback URLs** from `file_url` column  
- ✅ **File information** (size, type) for customer clarity

The EmailJS service will use this priority:
1. `download_link` (primary)
2. `file_url` (fallback)
3. Generated URL pattern (last resort)

## 📊 **Track Downloads (Optional)**

Create a downloads tracking table:

```sql
-- Optional: Track download activity
CREATE TABLE downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  user_id UUID REFERENCES auth.users(id),
  order_id UUID REFERENCES orders(id),
  download_url TEXT,
  downloaded_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own downloads
CREATE POLICY "Users can view own downloads" ON downloads
  FOR SELECT USING (auth.uid() = user_id);
```

## ✅ **Testing the Setup**

### 1. Test Database Changes
```sql
-- Verify all columns exist
SELECT * FROM products LIMIT 1;
```

### 2. Test Email Flow
1. Complete a test purchase
2. Check Success page processes order
3. Verify email is sent with download links
4. Test download link functionality

### 3. Test Download Links
- Verify URLs are accessible
- Check file downloads correctly
- Test on different devices/browsers

## 🆘 **Rollback (if needed)**

```sql
-- Remove columns if migration fails
ALTER TABLE products 
DROP COLUMN download_link,
DROP COLUMN file_url,
DROP COLUMN file_size,
DROP COLUMN file_type;
```

## 🔄 **After Migration**

1. **Regenerate TypeScript types**: `npm run db:types`
2. **Test locally** with updated schema
3. **Deploy to production**
4. **Update products** with real download links
5. **Test email delivery** end-to-end

Your digital product delivery system is now ready! 🚀
