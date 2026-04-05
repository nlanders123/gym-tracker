import { calculateHealthScore, NUTRI_SCORE_COLORS, NOVA_COLORS, NOVA_LABELS, GRADE_COLORS } from '../lib/health-score'

/**
 * Compact health badge showing score circle + Nutri-Score + NOVA for a food item.
 * Used inline on search results and barcode scan results.
 * Tap to open FoodDetailModal for full breakdown.
 */
export default function FoodHealthBadge({ food, onClick, compact = false }) {
  // Only show for foods with health data (OFF products, not USDA/local)
  if (!food.nutriScore && !food.novaGroup && (!food.additives || food.additives.length === 0)) {
    return null
  }

  const health = calculateHealthScore({
    nutriScore: food.nutriScore,
    novaGroup: food.novaGroup,
    additives: food.additives || [],
    labels: food.labels || [],
  })

  const scoreColor = GRADE_COLORS[health.grade]

  if (compact) {
    return (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClick?.(health, food) }}
        className="flex items-center gap-1 shrink-0"
        title="Health score — tap for details"
      >
        <ScoreCircle score={health.score} color={scoreColor} size={28} />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.(health, food) }}
      className="flex items-center gap-1.5 shrink-0 py-0.5"
      title="Health score — tap for details"
    >
      <ScoreCircle score={health.score} color={scoreColor} size={32} />
      {food.nutriScore && (
        <NutriScorePill grade={food.nutriScore} />
      )}
      {food.novaGroup && (
        <NovaPill group={food.novaGroup} />
      )}
    </button>
  )
}

function ScoreCircle({ score, color, size = 32 }) {
  const radius = (size - 4) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const center = size / 2

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={3}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{ fontSize: size * 0.32, color }}
      >
        {score}
      </div>
    </div>
  )
}

function NutriScorePill({ grade }) {
  const g = grade.toLowerCase()
  const color = NUTRI_SCORE_COLORS[g] || '#71717a'

  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-black uppercase"
      style={{ backgroundColor: color, color: g === 'a' || g === 'b' ? '#000' : '#fff' }}
    >
      {g}
    </span>
  )
}

function NovaPill({ group }) {
  const color = NOVA_COLORS[group] || '#71717a'
  const label = NOVA_LABELS[group] || `NOVA ${group}`

  return (
    <span
      className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-bold"
      style={{ backgroundColor: `${color}20`, color }}
      title={label}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {group}
    </span>
  )
}

export { ScoreCircle, NutriScorePill, NovaPill }
