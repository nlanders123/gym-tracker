import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const { user } = useAuth()

  const handleSignOut = () => {
    supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Apex</h1>
        <button 
          onClick={handleSignOut}
          className="text-sm font-medium text-zinc-400 hover:text-white"
        >
          Sign Out
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Placeholder cards for now */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">Today's Macros</h2>
          <p className="text-zinc-400">Database connected. UI coming next.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">Next Workout</h2>
          <p className="text-zinc-400">Database connected. UI coming next.</p>
        </div>
      </div>
    </div>
  )
}
