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
