-- Updated schema for persistent results
-- Run this in your Supabase SQL Editor

DROP TABLE IF EXISTS public.couples_quizzes;

CREATE TABLE public.couples_quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    creator_id UUID REFERENCES auth.users(id),
    slug TEXT UNIQUE NOT NULL,
    questions JSONB NOT NULL,
    creator_answers JSONB NOT NULL,
    partner_answers JSONB, -- Initially null
    score INTEGER -- Initially null
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.couples_quizzes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for anyone to create a quiz)
CREATE POLICY "Allow anonymous inserts" ON public.couples_quizzes
    FOR INSERT WITH CHECK (true);

-- Allow anonymous updates (for partners to save their answers)
CREATE POLICY "Allow anonymous updates" ON public.couples_quizzes
    FOR UPDATE USING (true);

-- Allow public reads by slug (for everyone to view the quiz or results)
CREATE POLICY "Allow public reads by slug" ON public.couples_quizzes
    FOR SELECT USING (true);
