import { useAuth } from '../contexts/AuthContext'

export default function Nutrition() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Nutrition</h1>
        <p className="text-zinc-400 text-sm">Today's macros and logging.</p>
      </header>

      {/* Target Progress Bar (Placeholder) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-3xl font-bold">0</span>
            <span className="text-zinc-500 ml-1">/ 2500 kcal</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="text-zinc-500 mb-1">Protein</div>
            <div className="font-bold">0 / 180g</div>
          </div>
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="text-zinc-500 mb-1">Fat</div>
            <div className="font-bold">0 / 70g</div>
          </div>
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="text-zinc-500 mb-1">Carbs</div>
            <div className="font-bold">0 / 250g</div>
          </div>
        </div>
      </div>

      {/* Meal Categories */}
      <div className="space-y-4">
        {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(meal => (
          <div key={meal} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{meal}</h3>
              <button className="text-sm font-bold text-white bg-zinc-800 px-3 py-1 rounded-lg hover:bg-zinc-700">
                + Add
              </button>
            </div>
            <div className="text-sm text-zinc-500">No foods logged.</div>
          </div>
        ))}
      </div>
    </div>
  )
}
