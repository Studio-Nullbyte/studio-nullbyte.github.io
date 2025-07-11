-- Create custom types
create type contact_status as enum ('new', 'in_progress', 'resolved');

-- Create tables
create table if not exists public.user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text,
  avatar_url text,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint user_profiles_user_id_key unique (user_id)
);

create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  price decimal(10,2) not null default 0,
  category_id uuid references public.categories(id) on delete cascade not null,
  image_url text,
  download_url text,
  preview_url text,
  tags text[] default '{}',
  featured boolean default false,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.download_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  downloaded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint download_history_user_product_unique unique (user_id, product_id)
);

create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint reviews_user_product_unique unique (user_id, product_id)
);

create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status contact_status default 'new'
);

-- Add admin role to user_profiles
alter table public.user_profiles add column if not exists role text default 'user' check (role in ('user', 'admin'));

-- Create orders table for tracking purchases
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  total_amount decimal(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  payment_method text,
  payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  price decimal(10,2) not null,
  quantity integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create admin activity log table
create table if not exists public.admin_activity_log (
  id uuid default gen_random_uuid() primary key,
  admin_user_id uuid references auth.users(id) on delete cascade not null,
  action text not null,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_featured on public.products(featured) where featured = true;
create index if not exists idx_products_active on public.products(active) where active = true;
create index if not exists idx_download_history_user_id on public.download_history(user_id);
create index if not exists idx_download_history_product_id on public.download_history(product_id);
create index if not exists idx_reviews_product_id on public.reviews(product_id);
create index if not exists idx_reviews_rating on public.reviews(rating);
create index if not exists idx_contact_submissions_status on public.contact_submissions(status);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);
create index if not exists idx_admin_activity_log_admin_user_id on public.admin_activity_log(admin_user_id);
create index if not exists idx_admin_activity_log_created_at on public.admin_activity_log(created_at);
create index if not exists idx_user_profiles_role on public.user_profiles(role);

-- Enable Row Level Security (RLS)
alter table public.user_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.download_history enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_activity_log enable row level security;

-- RLS Policies

-- User Profiles: Users can only see and edit their own profile
create policy "Users can view own profile" on public.user_profiles
  for select using (auth.uid() = user_id);

create policy "Users can update own profile" on public.user_profiles
  for update using (auth.uid() = user_id);

create policy "Users can insert own profile" on public.user_profiles
  for insert with check (auth.uid() = user_id);

-- Categories: Public read access
create policy "Categories are viewable by everyone" on public.categories
  for select using (true);

-- Products: Public read access for active products
create policy "Active products are viewable by everyone" on public.products
  for select using (active = true);

-- Download History: Users can only see their own downloads
create policy "Users can view own downloads" on public.download_history
  for select using (auth.uid() = user_id);

create policy "Users can insert own downloads" on public.download_history
  for insert with check (auth.uid() = user_id);

-- Reviews: Public read access, authenticated users can create their own
create policy "Reviews are viewable by everyone" on public.reviews
  for select using (true);

create policy "Authenticated users can create reviews" on public.reviews
  for insert with check (auth.role() = 'authenticated' and auth.uid() = user_id);

create policy "Users can update own reviews" on public.reviews
  for update using (auth.uid() = user_id);

-- Contact Submissions: Users can only insert
create policy "Anyone can submit contact forms" on public.contact_submissions
  for insert with check (true);

-- Orders: Users can view and manage their own orders
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can insert own orders" on public.orders
  for insert with check (auth.uid() = user_id);

-- Admins can manage all orders
create policy "Admins can view all orders" on public.orders
  for select using (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all orders" on public.orders
  for update using (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Order Items: Users can view and manage their own order items
create policy "Users can view own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders 
      where id = order_id and user_id = auth.uid()
    )
  );

create policy "Users can insert own order items" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders 
      where id = order_id and user_id = auth.uid()
    )
  );

-- Admins can manage all order items
create policy "Admins can view all order items" on public.order_items
  for select using (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Admin Activity Log: Only admins can view or insert logs
create policy "Admins can view admin activity log" on public.admin_activity_log
  for select using (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert admin activity log" on public.admin_activity_log
  for insert with check (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Update existing policies for admin access
-- Categories: Admins can manage categories
create policy "Admins can insert categories" on public.categories
  for insert with check (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update categories" on public.categories
  for update using (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete categories" on public.categories
  for delete using (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Products: Admins can manage all products
create policy "Admins can view all products" on public.products
  for select using (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert products" on public.products
  for insert with check (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update products" on public.products
  for update using (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete products" on public.products
  for delete using (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- User Profiles: Admins can view and edit all profiles
create policy "Admins can view all profiles" on public.user_profiles
  for select using (
    exists (
      select 1 from public.user_profiles up 
      where up.user_id = auth.uid() and up.role = 'admin'
    )
  );

create policy "Admins can update all profiles" on public.user_profiles
  for update using (
    exists (
      select 1 from public.user_profiles up 
      where up.user_id = auth.uid() and up.role = 'admin'
    )
  );

-- Contact Submissions: Admins can view and update all submissions
create policy "Admins can view all contact submissions" on public.contact_submissions
  for select using (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update contact submissions" on public.contact_submissions
  for update using (
    exists (
      select 1 from public.user_profiles 
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Functions

-- Function to handle user profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (user_id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
drop trigger if exists handle_updated_at on public.user_profiles;
create trigger handle_updated_at before update on public.user_profiles
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_updated_at on public.products;
create trigger handle_updated_at before update on public.products
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_updated_at on public.orders;
create trigger handle_updated_at before update on public.orders
  for each row execute procedure public.handle_updated_at();

-- Insert sample data
insert into public.categories (name, slug, description) values
  ('Web Templates', 'web', 'Modern web templates built with React, Next.js, and more'),
  ('Notion Templates', 'notion', 'Productivity and organization templates for Notion'),
  ('AI Prompts', 'ai', 'Carefully crafted prompts for ChatGPT, Claude, and other AI models'),
  ('Document Templates', 'docs', 'Professional document templates for business and personal use'),
  ('UI Components', 'ui', 'Reusable UI components and design systems')
on conflict (slug) do nothing;

-- Sample products
insert into public.products (title, description, price, category_id, tags, featured, image_url, preview_url) 
select 
  'Developer Portfolio Kit',
  'Complete portfolio template with dark mode, animations, and responsive design. Perfect for showcasing your development projects.',
  49.00,
  c.id,
  array['React', 'TypeScript', 'Tailwind', 'Framer Motion'],
  true,
  '/api/placeholder/400/300',
  'https://portfolio-demo.studionullbyte.com'
from public.categories c where c.slug = 'web'
on conflict do nothing;

insert into public.products (title, description, price, category_id, tags, featured, image_url, preview_url)
select 
  'AI Prompt Engineering Library',
  '200+ tested prompts for ChatGPT, Claude, and other AI models. Boost your productivity with proven prompt templates.',
  29.00,
  c.id,
  array['ChatGPT', 'Claude', 'Midjourney', 'Productivity'],
  true,
  '/api/placeholder/400/300',
  null
from public.categories c where c.slug = 'ai'
on conflict do nothing;

insert into public.products (title, description, price, category_id, tags, featured, image_url, preview_url)
select 
  'Notion Productivity System',
  'Complete productivity system with project management, habit tracking, and goal setting templates.',
  19.00,
  c.id,
  array['Productivity', 'GTD', 'Projects', 'Habits'],
  false,
  '/api/placeholder/400/300',
  'https://notion-template.studionullbyte.com'
from public.categories c where c.slug = 'notion'
on conflict do nothing;

-- Create default admin user (update email as needed)
insert into public.user_profiles (user_id, full_name, email, role)
select 
  id, 
  'Studio Nullbyte Admin',
  email,
  'admin'
from auth.users 
where email = 'studionullbyte@gmail.com'
on conflict (user_id) do update set role = 'admin';

-- Sample orders data
insert into public.orders (user_id, total_amount, status, payment_method, payment_id)
select 
  u.id,
  78.00,
  'completed',
  'stripe',
  'pi_test_1234567890'
from auth.users u
where u.email != 'studionullbyte@gmail.com'
limit 1
on conflict do nothing;

insert into public.order_items (order_id, product_id, price, quantity)
select 
  o.id,
  p.id,
  p.price,
  1
from public.orders o
cross join public.products p
where p.title = 'Developer Portfolio Kit'
limit 1
on conflict do nothing;
