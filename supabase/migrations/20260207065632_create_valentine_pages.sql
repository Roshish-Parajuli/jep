/*
  # Valentine's Gift Website Platform - Database Schema

  ## Overview
  This migration creates the database structure for a personalized Valentine's page platform
  where each unique slug represents a private, romantic page for one person.

  ## New Tables

  ### valentine_pages
  Stores the main content for each Valentine's page:
  - `id` (uuid, primary key) - Unique identifier
  - `slug` (text, unique) - Random hash for the URL (e.g., "a9f3k2x1")
  - `recipient_name` (text) - Name of the person receiving the Valentine
  - `hero_headline` (text) - Main headline on hero section
  - `hero_subtext` (text) - Subtitle or tagline
  - `secret_message` (text) - Hidden message to be revealed
  - `secret_code` (text, nullable) - Optional code/date to reveal the message
  - `love_letter` (text) - Main love letter content
  - `promises` (jsonb) - Array of promises
  - `timeline` (jsonb) - Array of timeline/memory events
  - `music_url` (text, nullable) - Optional background music URL
  - `final_message` (text) - Closing message for final surprise section
  - `created_at` (timestamp) - When the page was created

  ### valentine_photos
  Stores gallery photos for each Valentine's page:
  - `id` (uuid, primary key) - Unique identifier
  - `valentine_id` (uuid, foreign key) - References valentine_pages
  - `photo_url` (text) - URL to the photo
  - `caption` (text, nullable) - Optional caption for the photo
  - `display_order` (integer) - Order for displaying photos
  - `created_at` (timestamp) - When the photo was added

  ## Security
  - Row Level Security (RLS) enabled on both tables
  - Public read access (anyone with the slug can view)
  - No write access from client (admin only via service role)
*/

-- Create valentine_pages table
CREATE TABLE IF NOT EXISTS valentine_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  recipient_name text NOT NULL,
  hero_headline text NOT NULL DEFAULT 'For You, Always ❤️',
  hero_subtext text DEFAULT '',
  secret_message text NOT NULL,
  secret_code text,
  love_letter text NOT NULL,
  promises jsonb DEFAULT '[]'::jsonb,
  timeline jsonb DEFAULT '[]'::jsonb,
  music_url text,
  final_message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create valentine_photos table
CREATE TABLE IF NOT EXISTS valentine_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  valentine_id uuid NOT NULL REFERENCES valentine_pages(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  caption text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_valentine_pages_slug ON valentine_pages(slug);

-- Create index for faster photo queries
CREATE INDEX IF NOT EXISTS idx_valentine_photos_valentine_id ON valentine_photos(valentine_id);

-- Enable Row Level Security
ALTER TABLE valentine_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE valentine_photos ENABLE ROW LEVEL SECURITY;

-- Allow public read access to valentine_pages
CREATE POLICY "Anyone can view valentine pages"
  ON valentine_pages
  FOR SELECT
  USING (true);

-- Allow public read access to valentine_photos
CREATE POLICY "Anyone can view valentine photos"
  ON valentine_photos
  FOR SELECT
  USING (true);