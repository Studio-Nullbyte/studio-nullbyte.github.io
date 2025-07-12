-- SQL Script to Create Contact Submissions Table
-- Run this in your Supabase SQL Editor

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at ON contact_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Enable RLS (Row Level Security)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contact_submissions
DROP POLICY IF EXISTS "Admin can view all contact submissions" ON contact_submissions;
CREATE POLICY "Admin can view all contact submissions" ON contact_submissions FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  ));

DROP POLICY IF EXISTS "Admin can update contact submissions" ON contact_submissions;
CREATE POLICY "Admin can update contact submissions" ON contact_submissions FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  ));

DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON contact_submissions;
CREATE POLICY "Anyone can insert contact submissions" ON contact_submissions FOR INSERT 
  WITH CHECK (true);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample contact submissions for testing
INSERT INTO contact_submissions (name, email, subject, message, status) VALUES
('John Smith', 'john@example.com', 'Question about React templates', 'Hi, I''m interested in your React template collection. Do you have any e-commerce templates available?', 'new'),
('Sarah Johnson', 'sarah@company.com', 'Custom development inquiry', 'We need a custom Notion template for our team. Can you help with that?', 'new'),
('Mike Davis', 'mike@startup.com', 'Partnership proposal', 'I represent a startup and we''d like to explore a partnership with Studio Nullbyte.', 'read'),
('Emily Chen', 'emily@design.co', 'License question', 'What are the licensing terms for your AI prompt templates?', 'replied')
ON CONFLICT DO NOTHING;

-- Verify the table was created and data inserted
SELECT 
    'contact_submissions' as table_name, 
    count(*) as row_count 
FROM contact_submissions;

-- Show sample data
SELECT 
    name,
    email,
    subject,
    status,
    submitted_at
FROM contact_submissions
ORDER BY submitted_at DESC
LIMIT 5;
