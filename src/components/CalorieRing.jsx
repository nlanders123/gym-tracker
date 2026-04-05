/**
 * MFP-style calorie ring (SVG donut chart) with macro progress bars.
 * Shows consumed vs remaining calories in a circular progress indicator,
 * with horizontal progress bars for protein, fat, and carbs below.
 */
export default function CalorieRing({
  calories,
  calorieTarget,
  protein,
  proteinTarget,
  fat,
  fatTarget,
  carbs,
  carbsTarget,
  compact = false,
}) {
  const remaining = calorieTarget - calories
  const percent = calorieTarget > 0 ? Math.min(100, (calories / calorieTarget) * 100) : 0
  const isOver = calories > calorieTarget

  // Ring dimensions
  const size = compact ? 100 : 140
  const strokeWidth = compact ? 8 : 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (Math.min(percent, 100) / 100) * circumference
  const center = size / 2

  // Ring color based on threshold
  const ringColor = isOver ? '#ef4444' : percent > 80 ? '#eab308' : '#ffffff'

  return (
    <div>
      {/* Calorie ring */}
      <div className="flex items-center justify-center gap-5">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="block -rotate-90">
            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={strokeWidth}
            />
            {/* Progress arc */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth={strokeWidth}
              strokeDasharray={`${progress} ${circumference - progress}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="font-bold"
              style={{
                fontSize: compact ? 22 : 28,
                color: isOver ? '#ef4444' : '#ffffff',
              }}
            >
              {Math.abs(remaining)}
            </div>
            <div className="text-[10px] text-zinc-500 font-medium -mt-0.5">
              {isOver ? 'over' : 'remaining'}
            </div>
          </div>
        </div>

        {/* Calorie formula (non-compact only) */}
        {!compact && (
          <div className="text-xs text-zinc-500 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-zinc-600 w-10 text-right">Goal</span>
              <span className="text-zinc-300 font-bold">{calorieTarget}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-600 w-10 text-right">Food</span>
              <span className="text-zinc-300 font-bold">-{calories}</span>
            </div>
            <div className="border-t border-zinc-800 pt-1 flex items-center gap-2">
              <span className="text-zinc-600 w-10 text-right">=</span>
              <span className="font-bold" style={{ color: ringColor }}>
                {remaining}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Macro progress bars */}
      <div className={`grid grid-cols-3 gap-3 ${compact ? 'mt-3' : 'mt-5'}`}>
        <MacroBar
          label="Carbs"
          value={carbs}
          target={carbsTarget}
          color="#22c55e"
          compact={compact}
        />
        <MacroBar
          label="Fat"
          value={fat}
          target={fatTarget}
          color="#f59e0b"
          compact={compact}
        />
        <MacroBar
          label="Protein"
          value={protein}
          target={proteinTarget}
          color="#3b82f6"
          compact={compact}
        />
      </div>
    </div>
  )
}

function MacroBar({ label, value, target, color, compact }) {
  const percent = target > 0 ? Math.min(100, (value / target) * 100) : 0
  const isOver = value > target

  // Color threshold: green = on track, yellow = close, red = over
  const barColor = isOver ? '#ef4444' : percent > 80 ? '#eab308' : color

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] text-zinc-500 font-medium">{label}</span>
        <span className="text-[10px] text-zinc-500">
          <span className="text-zinc-300 font-bold">{value}</span>
          <span className="text-zinc-600">/{target}g</span>
        </span>
      </div>
      <div className={`bg-zinc-800 rounded-full overflow-hidden ${compact ? 'h-1.5' : 'h-2'}`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}
