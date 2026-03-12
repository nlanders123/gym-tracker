import { useEffect, useMemo, useState } from 'react'
import { Plus, Copy } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, updateTargets } from '../lib/api/profile'
import { getTodayMeals, copyYesterdayMeals } from '../lib/api/nutrition'
import MealLoggerModal from '../components/MealLoggerModal'

const MEAL_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']

function labelToEnum(label) {
  return label.toLowerCase() === 'snacks' ? 'snack' : label.toLowerCase()
}

export default function Nutrition() {
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditingTargets, setIsEditingTargets] = useState(false)
  const [targetForm, setTargetForm] = useState({ protein: 0, fat: 0, carbs: 0 })

  const [todayMeals, setTodayMeals] = useState([])
  const [totals, setTotals] = useState({ protein: 0, fat: 0, carbs: 0, calories: 0 })

  const [activeModalMealType, setActiveModalMealType] = useState(null)
  const [editingMeal, setEditingMeal] = useState(null)

  useEffect(() => {
    ;(async () => {
      await fetchProfile()
      await fetchTodayMeals()
      setLoading(false)
    })()
  }, [])

  const fetchProfile = async () => {
    const { data, error } = await getProfile(user.id)
    if (error) { console.error(error); return }

    setProfile(data)
    setTargetForm({
      protein: data.target_protein,
      fat: data.target_fat,
      carbs: data.target_carbs,
    })
  }

  const fetchTodayMeals = async () => {
    const { meals, totals: t, error } = await getTodayMeals(user.id)
    if (error) { console.error(error); return }

    setTodayMeals(meals)
    setTotals(t)
  }

  const remaining = useMemo(() => {
    if (!profile) return { protein: 0, fat: 0, carbs: 0, calories: 0 }
    return {
      protein: Math.max(0, (profile.target_protein || 0) - totals.protein),
      fat: Math.max(0, (profile.target_fat || 0) - totals.fat),
      carbs: Math.max(0, (profile.target_carbs || 0) - totals.carbs),
      calories: Math.max(0, (profile.target_calories || 0) - totals.calories),
    }
  }, [profile, totals])

  const handleUpdateTargets = async (e) => {
    e.preventDefault()
    const { data, error } = await updateTargets(user.id, {
      protein: Number(targetForm.protein),
      fat: Number(targetForm.fat),
      carbs: Number(targetForm.carbs),
    })

    if (error) { console.error(error); return }

    setProfile(data)
    setIsEditingTargets(false)
  }

  const handleCopyYesterday = async (mealLabel) => {
    const category = labelToEnum(mealLabel)
    const { error } = await copyYesterdayMeals(user.id, category)

    if (error) {
      console.error(error)
      // TODO: replace with toast
      alert(error.message)
      return
    }

    await fetchTodayMeals()
  }

  const openAddModal = (mealLabel) => {
    setEditingMeal(null)
    setActiveModalMealType(mealLabel)
  }

  const openEditModal = (meal) => {
    setActiveModalMealType(null)
    setEditingMeal(meal)
  }

  const closeModal = () => {
    setActiveModalMealType(null)
    setEditingMeal(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 flex items-center justify-center text-zinc-500">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 pb-24">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nutrition</h1>
          <p className="text-zinc-400 text-sm mt-1">Fast logging. No bloat.</p>
        </div>
        <button
          onClick={() => setIsEditingTargets(!isEditingTargets)}
          className="text-xs font-bold text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 hover:text-white transition"
        >
          {isEditingTargets ? 'Cancel' : 'Edit targets'}
        </button>
      </header>

      {isEditingTargets ? (
        <form onSubmit={handleUpdateTargets} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8">
          <h3 className="font-bold mb-4">Set daily targets</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { key: 'protein', label: 'Protein (g)' },
              { key: 'fat', label: 'Fat (g)' },
              { key: 'carbs', label: 'Carbs (g)' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs text-zinc-500 mb-1">{label}</label>
                <input
                  type="number"
                  value={targetForm[key]}
                  onChange={(e) => setTargetForm({ ...targetForm, [key]: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-zinc-600"
                />
              </div>
            ))}
          </div>
          <button type="submit" className="w-full bg-white text-zinc-950 font-bold rounded-xl py-2.5 hover:bg-zinc-200 transition">
            Save
          </button>
        </form>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Calories</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{totals.calories}</span>
                <span className="text-zinc-500 font-medium">/ {profile?.target_calories || 0}</span>
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                Remaining: <span className="text-zinc-200 font-semibold">{remaining.calories}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            {[
              { label: 'Protein', value: totals.protein, target: profile?.target_protein, rem: remaining.protein },
              { label: 'Fat', value: totals.fat, target: profile?.target_fat, rem: remaining.fat },
              { label: 'Carbs', value: totals.carbs, target: profile?.target_carbs, rem: remaining.carbs },
            ].map((m) => (
              <div key={m.label} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                <div className="text-zinc-500 text-xs font-bold mb-1">{m.label}</div>
                <div className="font-bold">
                  {m.value} <span className="text-zinc-600">/ {m.target}g</span>
                </div>
                <div className="text-[11px] text-zinc-600 mt-1">Rem: {m.rem}g</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {MEAL_CATEGORIES.map((mealLabel) => {
          const mealsInCategory = todayMeals.filter((m) => m.category === labelToEnum(mealLabel))

          return (
            <div key={mealLabel} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">{mealLabel}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyYesterday(mealLabel)}
                    className="flex items-center gap-1 text-xs font-bold text-zinc-300 bg-zinc-800 px-2.5 py-1.5 rounded-lg hover:bg-zinc-700 transition"
                    title="Copy yesterday"
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                  <button
                    onClick={() => openAddModal(mealLabel)}
                    className="flex items-center gap-1 text-sm font-bold text-zinc-900 bg-white px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition"
                  >
                    <Plus size={16} strokeWidth={3} /> Add
                  </button>
                </div>
              </div>

              {mealsInCategory.length === 0 ? (
                <div className="text-sm text-zinc-500 bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 text-center border-dashed">
                  No foods logged yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {mealsInCategory.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => openEditModal(m)}
                      className="w-full text-left flex justify-between items-center bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-950/70 transition"
                      title="Click to edit"
                    >
                      <span className="font-medium text-sm">{m.name}</span>
                      <span className="text-xs text-zinc-500 font-medium">
                        {m.protein}P  {m.fat}F  {m.carbs}C
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <MealLoggerModal
        isOpen={!!activeModalMealType}
        onClose={closeModal}
        mealType={activeModalMealType || ''}
        onLogSuccess={fetchTodayMeals}
      />

      <MealLoggerModal
        isOpen={!!editingMeal}
        onClose={closeModal}
        mealType={editingMeal?.category || ''}
        existingMeal={editingMeal}
        onLogSuccess={fetchTodayMeals}
      />
    </div>
  )
}
