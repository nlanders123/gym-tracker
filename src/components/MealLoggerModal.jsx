import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function MealLoggerModal({ isOpen, onClose, mealType, onLogSuccess }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setForm] = useState({
    name: 'Quick Add',
    protein: '',
    fat: '',
    carbs: ''
  })

  if (!isOpen) return null

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    const p = Number(formData.protein) || 0
    const f = Number(formData.fat) || 0
    const c = Number(formData.carbs) || 0
    const cals = (p * 4) + (c * 4) + (f * 9)

    try {
      // 1. Get or create today's daily log
      const today = new Date().toISOString().split('T')[0]
      
      let { data: dailyLog, error: logError } = await supabase
        .from('daily_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (logError && logError.code !== 'PGRST116') throw logError

      // Create log if it doesn't exist
      if (!dailyLog) {
        const { data: newLog, error: createError } = await supabase
          .from('daily_logs')
          .insert({ user_id: user.id, date: today })
          .select()
          .single()
          
        if (createError) throw createError
        dailyLog = newLog
      }

      // 2. Insert the meal
      const { error: mealError } = await supabase
        .from('logged_meals')
        .insert({
          daily_log_id: dailyLog.id,
          user_id: user.id,
          name: formData.name,
          category: mealType.toLowerCase(),
          protein: p,
          fat: f,
          carbs: c,
          calories: cals
        })

      if (mealError) throw mealError

      // Success
      setForm({ name: 'Quick Add', protein: '', fat: '', carbs: '' })
      onLogSuccess()
      onClose()
    } catch (error) {
      console.error('Error logging meal:', error.message)
      alert('Failed to log meal. See console.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 rounded-t-3xl sm:rounded-2xl border border-zinc-800 shadow-2xl p-6 transform transition-all">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add to {mealType}</h2>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition">
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Meal Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setForm({...formData, name: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-zinc-500 outline-none"
              placeholder="e.g. Steak and Potatoes"
              required 
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-1">Protein</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.protein}
                  onChange={(e) => setForm({...formData, protein: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-white font-bold focus:border-zinc-500 outline-none"
                  placeholder="0"
                />
                <span className="absolute right-3 top-3 text-zinc-600 font-medium">g</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-1">Fat</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.fat}
                  onChange={(e) => setForm({...formData, fat: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-white font-bold focus:border-zinc-500 outline-none"
                  placeholder="0"
                />
                <span className="absolute right-3 top-3 text-zinc-600 font-medium">g</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-1">Carbs</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.carbs}
                  onChange={(e) => setForm({...formData, carbs: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-white font-bold focus:border-zinc-500 outline-none"
                  placeholder="0"
                />
                <span className="absolute right-3 top-3 text-zinc-600 font-medium">g</span>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-zinc-950 font-bold rounded-xl py-3.5 mt-6 hover:bg-zinc-200 transition active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Log Macros'}
          </button>
        </form>

      </div>
    </div>
  )
}
