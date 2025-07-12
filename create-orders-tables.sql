-- SQL Script to Create Orders System Tables
-- Run this in your Supabase SQL Editor

-- Create categories table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create products table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  payment_method TEXT,
  payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Enable RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage categories" ON categories;
CREATE POLICY "Admin can manage categories" ON categories FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  ));

-- Create RLS policies for orders
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
CREATE POLICY "Admin can view all orders" ON orders FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  ));

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can update orders" ON orders;
CREATE POLICY "Admin can update orders" ON orders FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  ));

-- Create RLS policies for order_items
DROP POLICY IF EXISTS "Admin can view all order items" ON order_items;
CREATE POLICY "Admin can view all order items" ON order_items FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  ));

DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Create RLS policies for products
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products" ON products FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage products" ON products;
CREATE POLICY "Admin can manage products" ON products FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  ));

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Web Templates', 'React, Next.js, and other web development templates'),
('Notion Templates', 'Productivity and organization templates for Notion'),
('AI Prompts', 'Curated prompts for ChatGPT, Claude, and other AI tools'),
('UI Components', 'Reusable UI components and design systems'),
('Document Templates', 'Professional documents, contracts, and proposals')
ON CONFLICT (name) DO NOTHING;

-- Insert some sample products with correct category references
DO $$
DECLARE
    web_templates_id UUID;
    notion_templates_id UUID;
    ai_prompts_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO web_templates_id FROM categories WHERE name = 'Web Templates';
    SELECT id INTO notion_templates_id FROM categories WHERE name = 'Notion Templates';
    SELECT id INTO ai_prompts_id FROM categories WHERE name = 'AI Prompts';
    
    -- Insert products
    INSERT INTO products (title, description, price, category_id) VALUES
    ('React Template Pro', 'Professional React template with TypeScript', 49.99, web_templates_id),
    ('Notion Dashboard Template', 'Complete productivity dashboard for Notion', 29.99, notion_templates_id),
    ('AI Prompt Library', 'Collection of 100+ ChatGPT prompts', 19.99, ai_prompts_id)
    ON CONFLICT DO NOTHING;
END $$;

-- Create a sample order (optional)
DO $$
DECLARE
    sample_user_id UUID;
    sample_order_id UUID;
    sample_product_id UUID;
BEGIN
    -- Get a user ID (use your admin user or any existing user)
    SELECT id INTO sample_user_id FROM user_profiles LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        -- Create a sample order
        INSERT INTO orders (user_id, total_amount, status, payment_method, notes)
        VALUES (sample_user_id, 49.99, 'completed', 'stripe', 'Sample order for testing')
        RETURNING id INTO sample_order_id;
        
        -- Get a product ID
        SELECT id INTO sample_product_id FROM products LIMIT 1;
        
        IF sample_product_id IS NOT NULL AND sample_order_id IS NOT NULL THEN
            -- Create order item
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (sample_order_id, sample_product_id, 1, 49.99);
        END IF;
    END IF;
END $$;

-- Verify the tables were created
SELECT 
    'categories' as table_name, 
    count(*) as row_count 
FROM categories
UNION ALL
SELECT 
    'orders' as table_name, 
    count(*) as row_count 
FROM orders
UNION ALL
SELECT 
    'order_items' as table_name, 
    count(*) as row_count 
FROM order_items
UNION ALL
SELECT 
    'products' as table_name, 
    count(*) as row_count 
FROM products;