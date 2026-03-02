import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowLeft, Plus } from 'lucide-react'

function round(n) {
  if (n === null || n === undefined) return ''
  return Number(n)
}

export default function SessionLogger() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()

  const [session, setSession] = useState(null)
  const [exercises, setExercises] = useState([])
  const [setsByExercise, setSetsByExercise] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      await fetchSession()
      await fetchExercisesAndSets()
      setLoading(false)
    })()
  }, [id])

  const fetchSession = async () => {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    if (error) throw error
    setSession(data)
  }

  const fetchExercisesAndSets = async () => {
    const { data: ex, error: exErr } = await supabase
      .from('logged_exercises')
      .select('*')
      .eq('session_id', id)
      .eq('user_id', user.id)
      .order('order_index', { ascending: true })

    if (exErr) throw exErr

    const list = ex ?? []
    setExercises(list)

    if (list.length === 0) {
      setSetsByExercise({})
      return
    }

    const exIds = list.map((e) => e.id)

    const { data: sets, error: setsErr } = await supabase
      .from('logged_sets')
      .select('*')
      .in('exercise_id', exIds)
      .eq('user_id', user.id)
      .order('set_number', { ascending: true })

    if (setsErr) throw setsErr

    const map = {}
    for (const s of sets ?? []) {
      map[s.exercise_id] = map[s.exercise_id] || []
      map[s.exercise_id].push(s)
    }
    setSetsByExercise(map)
  }

  const addSet = async (exercise) => {
    const existing = setsByExercise[exercise.id] || []
    const nextNumber = existing.length + 1

    const { error } = await supabase
      .from('logged_sets')
      .insert({
        exercise_id: exercise.id,
        user_id: user.id,
        set_number: nextNumber,
        weight_kg: null,
        reps: null,
        is_warmup: false,
      })

    if (error) {
      alert(error.message)
      return
    }

    await fetchExercisesAndSets()
  }

  const updateSetField = async (setId, patch) => {
    const { error } = await supabase
      .from('logged_sets')
      .update(patch)
      .eq('id', setId)
      .eq('user_id', user.id)

    if (error) {
      alert(error.message)
      return
    }

    await fetchExercisesAndSets()
  }

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-500 p-6">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 pb-24">
      <header className="flex items-center gap-3 mb-6">
        <button
          onClick={() => nav('/workouts')}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition"
          title="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{session?.name}</h1>
          <p className="text-sm text-zinc-400">Session</p>
        </div>
      </header>

      {exercises.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-500 text-center">
          This session has no exercises yet.
        </div>
      ) : (
        <div className="space-y-4">
          {exercises.map((ex) => (
            <div key={ex.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">{ex.name}</h3>
                <button
                  onClick={() => addSet(ex)}
                  className="flex items-center gap-1 text-sm font-bold text-zinc-900 bg-white px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition"
                >
                  <Plus size={16} strokeWidth={3} /> Add set
                </button>
              </div>

              <div className="space-y-2">
                {(setsByExercise[ex.id] || []).length === 0 ? (
                  <div className="text-sm text-zinc-500 bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 text-center border-dashed">
                    No sets logged.
                  </div>
                ) : (
                  (setsByExercise[ex.id] || []).map((s) => (
                    <div
                      key={s.id}
                      className="grid grid-cols-12 gap-2 items-center bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50"
                    >
                      <div className="col-span-2 text-xs font-bold text-zinc-500">Set {s.set_number}</div>
                      <div className="col-span-5">
                        <input
                          inputMode="decimal"
                          placeholder="kg"
                          value={s.weight_kg ?? ''}
                          onChange={(e) => updateSetField(s.id, { weight_kg: e.target.value === '' ? null : Number(e.target.value) })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-zinc-600"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          inputMode="numeric"
                          placeholder="reps"
                          value={s.reps ?? ''}
                          onChange={(e) => updateSetField(s.id, { reps: e.target.value === '' ? null : Number(e.target.value) })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-zinc-600"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="text-xs text-zinc-600 mt-3">
                Last time (v1): coming next.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
