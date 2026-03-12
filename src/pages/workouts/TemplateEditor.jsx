import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  getTemplateExercises,
  addTemplateExercise,
  removeTemplateExercise,
  startSession,
} from '../../lib/api/workouts'
import { supabase } from '../../lib/supabase'
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
      try {
        await fetchTemplate()
        await fetchExercises()
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const fetchTemplate = async () => {
    // Template fetch stays direct — single one-off query, not worth abstracting
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
    const { data, error } = await getTemplateExercises(user.id, id)
    if (error) { console.error(error); return }
    setExercises(data)
  }

  const handleAddExercise = async (e) => {
    e.preventDefault()
    const name = newExercise.trim()
    if (!name) return

    const { error } = await addTemplateExercise(user.id, id, name, exercises.length)
    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    setNewExercise('')
    await fetchExercises()
  }

  const handleRemoveExercise = async (exerciseId) => {
    if (!confirm('Remove this exercise from the template?')) return

    const { error } = await removeTemplateExercise(user.id, exerciseId)
    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    await fetchExercises()
  }

  const handleStartSession = async () => {
    if (!template) return

    const { data: session, error } = await startSession(user.id, template, exercises)
    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    nav(`/session/${session.id}`)
  }

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-500 p-6">Loading...</div>
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
          onClick={handleStartSession}
          className="flex items-center gap-2 bg-white text-zinc-950 font-bold px-4 py-2 rounded-xl hover:bg-zinc-200 transition"
        >
          <Play size={16} /> Start
        </button>
      </header>

      <form onSubmit={handleAddExercise} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-5">
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
                onClick={() => handleRemoveExercise(ex.id)}
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
