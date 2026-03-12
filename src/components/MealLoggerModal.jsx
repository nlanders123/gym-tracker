import { useEffect, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { logMeal, updateMeal, deleteMeal } from '../lib/api/nutrition'

function toMealEnum(mealTypeLabel) {
  return mealTypeLabel.toLowerCase() === 'snacks' ? 'snack' : mealTypeLabel.toLowerCase()
}

export default function MealLoggerModal({
  isOpen,
  onClose,
  mealType,
  onLogSuccess,
  existingMeal = null,
}) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setForm] = useState({
    name: 'Quick Add',
    protein: '',
    fat: '',
    carbs: '',
  })

  const isEdit = !!existingMeal

  useEffect(() => {
    if (!isOpen) return
    if (existingMeal) {
      setForm({
        name: existingMeal.name ?? 'Quick Add',
        protein: String(existingMeal.protein ?? ''),
        fat: String(existingMeal.fat ?? ''),
        carbs: String(existingMeal.carbs ?? ''),
      })
    } else {
      setForm({ name: 'Quick Add', protein: '', fat: '', carbs: '' })
    }
  }, [isOpen, existingMeal])

  if (!isOpen) return null

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    const p = Number(formData.protein) || 0
    const f = Number(formData.fat) || 0
    const c = Number(formData.carbs) || 0

    try {
      if (isEdit) {
        const { error } = await updateMeal(user.id, existingMeal.id, {
          name: formData.name,
          protein: p,
          fat: f,
          carbs: c,
        })
        if (error) throw error
      } else {
        const { error } = await logMeal(user.id, {
          category: toMealEnum(mealType),
          name: formData.name,
          protein: p,
          fat: f,
          carbs: c,
        })
        if (error) throw error
      }

      onLogSuccess()
      onClose()
    } catch (error) {
      console.error('Error logging meal:', error)
      // TODO: replace with toast
      alert(error?.message || 'Failed to log meal')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!existingMeal) return
    if (!confirm('Delete this meal?')) return

    setLoading(true)
    try {
      const { error } = await deleteMeal(user.id, existingMeal.id)
      if (error) throw error

      onLogSuccess()
      onClose()
    } catch (error) {
      console.error('Error deleting meal:', error)
      alert(error?.message || 'Failed to delete meal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 rounded-t-3xl sm:rounded-2xl border border-zinc-800 shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{isEdit ? 'Edit meal' : `Add to ${mealType}`}</h2>
          <div className="flex items-center gap-2">
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition disabled:opacity-50"
                title="Delete"
              >
                <Trash2 size={16} strokeWidth={2.5} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
              title="Close"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Meal Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setForm({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-zinc-500 outline-none"
              placeholder="e.g. Steak and potatoes"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'protein', label: 'Protein' },
              { key: 'fat', label: 'Fat' },
              { key: 'carbs', label: 'Carbs' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-bold text-zinc-400 mb-1">{label}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData[key]}
                    onChange={(e) => setForm({ ...formData, [key]: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-white font-bold focus:border-zinc-500 outline-none"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-3 text-zinc-600 font-medium">g</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-zinc-950 font-bold rounded-xl py-3.5 mt-6 hover:bg-zinc-200 transition active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Log macros'}
          </button>
        </form>
      </div>
    </div>
  )
}
