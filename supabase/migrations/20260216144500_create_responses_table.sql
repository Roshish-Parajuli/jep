/*
  # Create Gift Site Responses Table

  ## Purpose
  This migration creates a table to store responses from gift site visitors.
  When someone responds to a proposal (valentine_ask template), their answer
  along with optional message and date are stored here.

  ## Features
  - Stores response type (yes, no, maybe)
  - Optional message field for personalized replies
  - Optional date field for scheduling
  - Links to gift_sites table via foreign key
  - Row Level Security enabled for privacy
*/

-- Create gift_site_responses table
CREATE TABLE public.gift_site_responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_site_id uuid REFERENCES public.gift_sites(id) ON DELETE CASCADE NOT NULL,
  response_type text NOT NULL CHECK (response_type IN ('yes', 'no', 'maybe')),
  message text,
  selected_date date,
  responded_at timestamptz DEFAULT now()
);

-- Create index for faster lookups by gift_site_id
CREATE INDEX idx_gift_site_responses_gift_site_id ON public.gift_site_responses(gift_site_id);

-- Enable Row Level Security
ALTER TABLE public.gift_site_responses ENABLE ROW LEVEL SECURITY;

-- Anyone can insert responses (public sites are accessible to anyone)
CREATE POLICY "Anyone can submit responses"
  ON public.gift_site_responses
  FOR INSERT
  WITH CHECK (true);

-- Only site creators can view responses to their own sites
CREATE POLICY "Site creators can view responses to their sites"
  ON public.gift_site_responses
  FOR SELECT
  USING (
    gift_site_id IN (
      SELECT id FROM public.gift_sites WHERE user_id = auth.uid()
    )
  );

-- Site creators can delete responses to their own sites
CREATE POLICY "Site creators can delete responses"
  ON public.gift_site_responses
  FOR DELETE
  USING (
    gift_site_id IN (
      SELECT id FROM public.gift_sites WHERE user_id = auth.uid()
    )
  );
