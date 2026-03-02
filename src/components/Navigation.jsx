import { NavLink } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800 pb-safe">
      <div className="max-w-md mx-auto flex justify-around p-2">
        <NavLink 
          to="/" 
          className={({isActive}) => `flex flex-col items-center p-3 rounded-xl transition ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <span className="text-xl mb-1">🏠</span>
          <span className="text-[10px] font-bold">Home</span>
        </NavLink>
        
        <NavLink 
          to="/workouts" 
          className={({isActive}) => `flex flex-col items-center p-3 rounded-xl transition ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <span className="text-xl mb-1">🏋️‍♂️</span>
          <span className="text-[10px] font-bold">Workout</span>
        </NavLink>

        <NavLink 
          to="/nutrition" 
          className={({isActive}) => `flex flex-col items-center p-3 rounded-xl transition ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <span className="text-xl mb-1">🥩</span>
          <span className="text-[10px] font-bold">Food</span>
        </NavLink>
      </div>
    </nav>
  )
}
