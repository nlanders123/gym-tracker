-- ==========================================
-- APEX: Supabase Master Schema (MVP)
-- ==========================================

-- 1. Create a custom ENUM type for meal categories
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- ==========================================
-- PROFILES (Users)
-- Ties into Supabase's built-in Auth system
-- ==========================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Global MVP Targets
    target_calories INTEGER DEFAULT 2500,
    target_protein INTEGER DEFAULT 180,
    target_fat INTEGER DEFAULT 70,
    target_carbs INTEGER DEFAULT 250
);

-- Secure the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to fire the function on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- NUTRITION: Daily Logs & Meals
-- ==========================================

-- The Daily Log (One row per user, per day)
CREATE TABLE daily_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- We can store the targets they had ON THIS DAY so historical data doesn't 
    -- break if they change their global targets later.
    target_calories INTEGER,
    target_protein INTEGER,
    target_fat INTEGER,
    target_carbs INTEGER,
    
    UNIQUE(user_id, date) -- A user can only have one log per day
);

ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own daily logs" ON daily_logs FOR ALL USING (auth.uid() = user_id);

-- Logged Meals (Attached to a Daily Log)
CREATE TABLE logged_meals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    name TEXT NOT NULL, -- e.g., "Quick Add", "Oats", "Chicken & Rice"
    category meal_type NOT NULL, -- breakfast, lunch, etc.
    
    -- The macros for this specific meal entry
    calories INTEGER NOT NULL DEFAULT 0,
    protein INTEGER NOT NULL DEFAULT 0,
    fat INTEGER NOT NULL DEFAULT 0,
    carbs INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE logged_meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own logged meals" ON logged_meals FOR ALL USING (auth.uid() = user_id);


-- ==========================================
-- WORKOUTS: Templates, Sessions, Exercises, Sets
-- ==========================================

-- Workout Templates (e.g., "Push Day A")
CREATE TABLE workout_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own templates" ON workout_templates FOR ALL USING (auth.uid() = user_id);

-- Workout Sessions (The actual logged workout on a specific day)
CREATE TABLE workout_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES workout_templates(id) ON DELETE SET NULL, -- Optional
    
    name TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    duration_minutes INTEGER,
    notes TEXT
);

ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON workout_sessions FOR ALL USING (auth.uid() = user_id);

-- Logged Exercises (Attached to a Session)
CREATE TABLE logged_exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    name TEXT NOT NULL, -- e.g., "Bench Press"
    order_index INTEGER NOT NULL, -- e.g., 1st exercise, 2nd exercise
    notes TEXT
);

ALTER TABLE logged_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own logged exercises" ON logged_exercises FOR ALL USING (auth.uid() = user_id);

-- Logged Sets (Attached to an Exercise)
CREATE TABLE logged_sets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exercise_id UUID REFERENCES logged_exercises(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    set_number INTEGER NOT NULL,
    weight_kg NUMERIC,
    reps INTEGER,
    is_warmup BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE logged_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own logged sets" ON logged_sets FOR ALL USING (auth.uid() = user_id);
