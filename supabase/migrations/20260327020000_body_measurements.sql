-- Body measurements tracking
CREATE TABLE body_measurements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    measurement_type TEXT NOT NULL CHECK (measurement_type IN ('waist', 'chest', 'hips', 'left_arm', 'right_arm', 'left_thigh', 'right_thigh', 'neck', 'shoulders')),
    value_cm NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    UNIQUE(user_id, date, measurement_type)
);

ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own measurements"
    ON body_measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own measurements"
    ON body_measurements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own measurements"
    ON body_measurements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own measurements"
    ON body_measurements FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_measurements_user_date ON body_measurements(user_id, date DESC);
