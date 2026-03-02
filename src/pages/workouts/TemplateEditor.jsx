import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowLeft, Plus, Play } from 'lucide-react'

export default function TemplateEditor() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()

  const [template, setTemplate] = useState(null)
  const [exercises, setExercises] = useState([])
  const [newExercise, setNewExercise] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      await fetchTemplate()
      await fetchExercises()
      setLoading(false)
    })()
  }, [id])

  const fetchTemplate = async () => {
    const { data, error } = await supabase
      .from('workout_templates')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    if (error) throw error
    setTemplate(data)
  }

  const fetchExercises = async () => {
    const { data, error } = await supabase
      .from('template_exercises')
      .select('*')
      .eq('template_id', id)
      .eq('user_id', user.id)
      .order('order_index', { ascending: true })
    if (error) throw error
    setExercises(data ?? [])
  }

  const addExercise = async (e) => {
    e.preventDefault()
    const name = newExercise.trim()
    if (!name) return

    const orderIndex = exercises.length

    const { error } = await supabase
      .from('template_exercises')
      .insert({ template_id: id, user_id: user.id, name, order_index: orderIndex })

    if (error) {
      alert(error.message)
      return
    }

    setNewExercise('')
    await fetchExercises()
  }

  const removeExercise = async (exerciseId) => {
    if (!confirm('Remove this exercise from the template?')) return

    const { error } = await supabase
      .from('template_exercises')
      .delete()
      .eq('id', exerciseId)
      .eq('user_id', user.id)

    if (error) {
      alert(error.message)
      return
    }

    await fetchExercises()
  }

  const startSession = async () => {
    if (!template) return

    // Create session
    const { data: session, error: sessionErr } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: user.id,
        template_id: template.id,
        name: template.name,
      })
      .select('*')
      .single()

    if (sessionErr) {
      alert(sessionErr.message)
      return
    }

    // Copy exercises into logged_exercises
    if (exercises.length) {
      const inserts = exercises.map((ex) => ({
        session_id: session.id,
        user_id: user.id,
        name: ex.name,
        order_index: ex.order_index,
      }))

      const { error: exErr } = await supabase.from('logged_exercises').insert(inserts)
      if (exErr) {
        alert(exErr.message)
        return
      }
    }

    nav(`/session/${session.id}`)
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
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{template?.name}</h1>
          <p className="text-sm text-zinc-400">Template</p>
        </div>
        <button
          onClick={startSession}
          className="flex items-center gap-2 bg-white text-zinc-950 font-bold px-4 py-2 rounded-xl hover:bg-zinc-200 transition"
        >
          <Play size={16} /> Start
        </button>
      </header>

      <form onSubmit={addExercise} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-5">
        <div className="flex gap-2">
          <input
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            placeholder="Add exercise (e.g. Bench Press)"
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-zinc-600"
          />
          <button
            type="submit"
            className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 px-3 rounded-xl hover:bg-zinc-700 transition font-bold"
          >
            <Plus size={18} />
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {exercises.length === 0 ? (
          <div className="text-sm text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
            Add exercises to this template.
          </div>
        ) : (
          exercises.map((ex) => (
            <div
              key={ex.id}
              className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
            >
              <div>
                <div className="font-bold">{ex.name}</div>
                <div className="text-xs text-zinc-500">Exercise {ex.order_index + 1}</div>
              </div>
              <button
                onClick={() => removeExercise(ex.id)}
                className="text-xs font-bold text-zinc-400 hover:text-white"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
