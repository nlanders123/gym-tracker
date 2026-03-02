-- ==========================================
-- APEX Migration 001: Templates + Onboarding
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1) Add onboarding flag to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarded BOOLEAN DEFAULT false;

-- 2) Template exercises (so templates can contain ordered exercises)
CREATE TABLE IF NOT EXISTS template_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES workout_templates(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can manage own template exercises"
ON template_exercises
FOR ALL
USING (auth.uid() = user_id);

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_template_exercises_template_id
ON template_exercises(template_id);
