-- Add fields for Mifflin-St Jeor calorie calculator
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS height_cm NUMERIC,
  ADD COLUMN IF NOT EXISTS weight_kg NUMERIC,
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS sex TEXT CHECK (sex IN ('male', 'female')),
  ADD COLUMN IF NOT EXISTS activity_level TEXT DEFAULT 'moderate' CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very_active', 'extra_active')),
  ADD COLUMN IF NOT EXISTS weight_goal TEXT DEFAULT 'maintain' CHECK (weight_goal IN ('lose_1', 'lose_0.5', 'maintain', 'gain_0.5', 'gain_1'));
