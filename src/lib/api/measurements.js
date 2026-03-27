import { supabase } from '../supabase'

const MEASUREMENT_TYPES = ['waist', 'chest', 'hips', 'left_arm', 'right_arm', 'left_thigh', 'right_thigh', 'neck', 'shoulders']

const MEASUREMENT_LABELS = {
  waist: 'Waist',
  chest: 'Chest',
  hips: 'Hips',
  left_arm: 'Left Arm',
  right_arm: 'Right Arm',
  left_thigh: 'Left Thigh',
  right_thigh: 'Right Thigh',
  neck: 'Neck',
  shoulders: 'Shoulders',
}

export { MEASUREMENT_TYPES, MEASUREMENT_LABELS }

export async function logMeasurement(userId, type, valueCm, date) {
  const dateStr = date || new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('body_measurements')
    .upsert(
      { user_id: userId, measurement_type: type, value_cm: valueCm, date: dateStr },
      { onConflict: 'user_id,date,measurement_type' }
    )
    .select('*')
    .single()

  return { data, error }
}

export async function getLatestMeasurements(userId) {
  // Get most recent measurement for each type
  const { data, error } = await supabase
    .from('body_measurements')
    .select('measurement_type, value_cm, date')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(100)

  if (error) return { data: {}, error }

  // Deduplicate: keep most recent per type
  const latest = {}
  for (const m of data) {
    if (!latest[m.measurement_type]) {
      latest[m.measurement_type] = m
    }
  }

  return { data: latest, error: null }
}

export async function getMeasurementHistory(userId, type, limit = 30) {
  const { data, error } = await supabase
    .from('body_measurements')
    .select('value_cm, date')
    .eq('user_id', userId)
    .eq('measurement_type', type)
    .order('date', { ascending: false })
    .limit(limit)

  return { data: data || [], error }
}
