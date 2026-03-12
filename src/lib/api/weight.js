import { supabase } from '../supabase'

export async function logWeight(userId, weightKg, date) {
  const dateStr = date || new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('body_weight')
    .upsert(
      { user_id: userId, date: dateStr, weight_kg: weightKg },
      { onConflict: 'user_id,date' }
    )
    .select('*')
    .single()

  return { data, error }
}

export async function getWeightHistory(userId, limit = 30) {
  const { data, error } = await supabase
    .from('body_weight')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit)

  return { data: data ?? [], error }
}

export async function getLatestWeight(userId) {
  const { data, error } = await supabase
    .from('body_weight')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle()

  return { data, error }
}
