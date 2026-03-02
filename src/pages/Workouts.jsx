import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Workouts() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('sessions') // 'sessions' | 'templates'

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <p className="text-zinc-400 text-sm">Log sessions and manage templates.</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-zinc-900 rounded-lg p-1 mb-6">
        <button 
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition ${activeTab === 'sessions' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition ${activeTab === 'templates' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Templates
        </button>
      </div>

      {/* Content */}
      {activeTab === 'sessions' ? (
        <div className="space-y-4">
          <button className="w-full bg-white text-zinc-950 font-bold rounded-xl py-3 hover:bg-zinc-200 transition">
            + Start Empty Session
          </button>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-500">
            No workout history yet.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button className="w-full bg-zinc-800 text-white font-bold rounded-xl py-3 border border-zinc-700 hover:bg-zinc-700 transition">
            + Create New Template
          </button>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-500">
            No templates built yet.
          </div>
        </div>
      )}
    </div>
  )
}
