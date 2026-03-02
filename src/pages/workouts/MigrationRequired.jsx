export default function MigrationRequired({ title = 'Migration required', body }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 pb-24">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-zinc-400 mb-6">
        {body || 'This feature needs a small Supabase migration run once.'}
      </p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="text-sm text-zinc-300 font-bold mb-2">What to do</div>
        <ol className="list-decimal pl-5 text-sm text-zinc-400 space-y-1">
          <li>Open Supabase → SQL Editor</li>
          <li>Run: <span className="text-zinc-200 font-semibold">supabase_migration_001_workouts.sql</span></li>
          <li>Refresh the app</li>
        </ol>
      </div>
    </div>
  )
}
