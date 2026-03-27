import { supabase } from '../supabase'

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export async function updateTargets(userId, { protein, fat, carbs }) {
  const calories = protein * 4 + carbs * 4 + fat * 9

  const { data, error } = await supabase
    .from('profiles')
    .update({
      target_protein: protein,
      target_fat: fat,
      target_carbs: carbs,
      target_calories: calories,
    })
    .eq('id', userId)
    .select('*')
    .single()

  return { data, error }
}

export async function updateProfile(userId, fields) {
  const { data, error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', userId)
    .select('*')
    .single()

  return { data, error }
}

// Mifflin-St Jeor equation
// Men:   BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(years) + 5
// Women: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(years) - 161
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
}

const GOAL_OFFSETS = {
  'lose_1': -500,
  'lose_0.5': -250,
  maintain: 0,
  'gain_0.5': 250,
  gain_1: 500,
}

export function calculateTargets({ heightCm, weightKg, birthDate, sex, activityLevel, weightGoal }) {
  if (!heightCm || !weightKg || !birthDate || !sex) return null

  const age = Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161)
  const tdee = bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.55)
  const calories = Math.round(tdee + (GOAL_OFFSETS[weightGoal] || 0))

  // Standard macro split: 30% protein, 25% fat, 45% carbs
  const protein = Math.round((calories * 0.30) / 4)
  const fat = Math.round((calories * 0.25) / 9)
  const carbs = Math.round((calories * 0.45) / 4)

  return { calories, protein, fat, carbs, bmr: Math.round(bmr), tdee: Math.round(tdee) }
}
