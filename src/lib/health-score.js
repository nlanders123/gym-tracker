// YUKA-style health score calculator (0-100)
// Formula: 60% nutritional quality (Nutri-Score) + 30% additives + 10% organic
// Hard cap: any high-risk additive caps score at max 49

import { analyzeAdditives } from './additive-risks.js'

// Nutri-Score grade → base nutritional quality score (0-100)
const NUTRI_SCORE_MAP = {
  a: 100,
  b: 80,
  c: 60,
  d: 40,
  e: 20,
}

// NOVA group descriptions
export const NOVA_LABELS = {
  1: 'Unprocessed',
  2: 'Processed ingredient',
  3: 'Processed food',
  4: 'Ultra-processed',
}

export const NOVA_COLORS = {
  1: '#22c55e', // green
  2: '#a3e635', // lime
  3: '#f97316', // orange
  4: '#ef4444', // red
}

export const NOVA_DESCRIPTIONS = {
  1: 'Unprocessed or minimally processed foods — fresh fruits, vegetables, eggs, meat, milk.',
  2: 'Processed culinary ingredients — oils, butter, sugar, salt, flour.',
  3: 'Processed foods — canned goods, cheese, simple bread, smoked meats.',
  4: 'Ultra-processed food and drink products — soft drinks, chips, instant noodles, packaged snacks, reconstituted meats.',
}

// Nutri-Score letter badge colors
export const NUTRI_SCORE_COLORS = {
  a: '#22c55e',
  b: '#a3e635',
  c: '#eab308',
  d: '#f97316',
  e: '#ef4444',
}

/**
 * Calculate a YUKA-style health score (0-100).
 *
 * @param {Object} product — Open Food Facts product data
 * @param {string} product.nutriScore — Nutri-Score grade (a-e)
 * @param {number} product.novaGroup — NOVA group (1-4)
 * @param {string[]} product.additives — Array of additive tags (e.g. ["en:e322", "en:e471"])
 * @param {string[]} product.labels — Product label tags (e.g. ["en:organic"])
 * @returns {{ score, grade, nutriScore, novaGroup, additiveAnalysis, isOrganic, breakdown }}
 */
export function calculateHealthScore({ nutriScore, novaGroup, additives = [], labels = [] }) {
  // 1. Nutritional quality (60%)
  const nutriGrade = (nutriScore || '').toLowerCase()
  const nutritionBase = NUTRI_SCORE_MAP[nutriGrade] ?? 50 // default to middle if unknown
  const nutritionScore = nutritionBase * 0.6

  // 2. Additives (30%)
  const additiveAnalysis = analyzeAdditives(additives)
  // Start at 100 (perfect), apply penalties, floor at 0
  const additiveBase = Math.max(0, Math.min(100, 100 + additiveAnalysis.totalPenalty))
  const additiveScore = additiveBase * 0.3

  // 3. Organic bonus (10%)
  const isOrganic = labels.some(
    (l) => l.includes('organic') || l.includes('bio') || l.includes('ecolog')
  )
  const organicScore = isOrganic ? 10 : 0

  // Raw score
  let score = Math.round(nutritionScore + additiveScore + organicScore)

  // Hard cap: any high-risk additive → max 49
  if (additiveAnalysis.hasHighRisk) {
    score = Math.min(score, 49)
  }

  // Clamp 0-100
  score = Math.max(0, Math.min(100, score))

  // Grade assignment
  const grade = getGrade(score)

  return {
    score,
    grade,
    nutriScore: nutriGrade || null,
    novaGroup: novaGroup || null,
    additiveAnalysis,
    isOrganic,
    breakdown: {
      nutrition: Math.round(nutritionScore),
      additives: Math.round(additiveScore),
      organic: organicScore,
    },
  }
}

function getGrade(score) {
  if (score >= 75) return 'excellent'
  if (score >= 50) return 'good'
  if (score >= 25) return 'mediocre'
  return 'poor'
}

export const GRADE_LABELS = {
  excellent: 'Excellent',
  good: 'Good',
  mediocre: 'Mediocre',
  poor: 'Poor',
}

export const GRADE_COLORS = {
  excellent: '#22c55e',
  good: '#a3e635',
  mediocre: '#f97316',
  poor: '#ef4444',
}
