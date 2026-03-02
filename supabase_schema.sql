-- Create the couples_quizzes table
CREATE TABLE IF NOT EXISTS public.couples_quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    creator_id UUID REFERENCES auth.users(id),
    slug TEXT UNIQUE NOT NULL,
    questions JSONB NOT NULL,
    answers JSONB NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.couples_quizzes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for anyone to create a quiz)
CREATE POLICY "Allow anonymous inserts" ON public.couples_quizzes
    FOR INSERT WITH CHECK (true);

-- Allow public reads by slug (for partners to view the quiz)
CREATE POLICY "Allow public reads by slug" ON public.couples_quizzes
    FOR SELECT USING (true);
