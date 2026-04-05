// Additive risk database — maps E-numbers to risk tiers
// Sources: EFSA evaluations, IARC classifications, published systematic reviews
// Risk tiers match YUKA's 4-level system:
//   0 = no risk (green), 1 = limited risk (yellow), 2 = moderate risk (orange), 3 = high risk (red)
//
// Coverage: ~220 common food additives found in Open Food Facts data
// This is NOT exhaustive — unknown additives default to risk level 1 (limited/caution)

export const RISK_LABELS = ['No risk', 'Limited risk', 'Moderate risk', 'High risk']
export const RISK_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'] // green, yellow, orange, red
export const RISK_BG_COLORS = ['rgba(34,197,94,0.15)', 'rgba(234,179,8,0.15)', 'rgba(249,115,22,0.15)', 'rgba(239,68,68,0.15)']

// Point penalties per YUKA formula
export const RISK_PENALTIES = [0, -6, -15, -30]

const ADDITIVES = {
  // ─── COLORS ───
  'en:e100': { name: 'Curcumin', risk: 0 },
  'en:e101': { name: 'Riboflavin', risk: 0 },
  'en:e102': { name: 'Tartrazine', risk: 3 },
  'en:e104': { name: 'Quinoline Yellow', risk: 3 },
  'en:e110': { name: 'Sunset Yellow FCF', risk: 3 },
  'en:e120': { name: 'Cochineal / Carmine', risk: 1 },
  'en:e122': { name: 'Azorubine', risk: 3 },
  'en:e123': { name: 'Amaranth', risk: 3 },
  'en:e124': { name: 'Ponceau 4R', risk: 3 },
  'en:e127': { name: 'Erythrosine', risk: 3 },
  'en:e129': { name: 'Allura Red AC', risk: 3 },
  'en:e131': { name: 'Patent Blue V', risk: 2 },
  'en:e132': { name: 'Indigotine', risk: 1 },
  'en:e133': { name: 'Brilliant Blue FCF', risk: 1 },
  'en:e140': { name: 'Chlorophylls', risk: 0 },
  'en:e141': { name: 'Copper Chlorophyllin', risk: 0 },
  'en:e142': { name: 'Green S', risk: 2 },
  'en:e150a': { name: 'Plain Caramel', risk: 0 },
  'en:e150b': { name: 'Caustic Sulphite Caramel', risk: 2 },
  'en:e150c': { name: 'Ammonia Caramel', risk: 2 },
  'en:e150d': { name: 'Sulphite Ammonia Caramel', risk: 2 },
  'en:e151': { name: 'Brilliant Black BN', risk: 2 },
  'en:e153': { name: 'Vegetable Carbon', risk: 1 },
  'en:e155': { name: 'Brown HT', risk: 2 },
  'en:e160a': { name: 'Beta-Carotene', risk: 0 },
  'en:e160b': { name: 'Annatto', risk: 0 },
  'en:e160c': { name: 'Paprika Extract', risk: 0 },
  'en:e160d': { name: 'Lycopene', risk: 0 },
  'en:e160e': { name: 'Beta-Apo-8-Carotenal', risk: 0 },
  'en:e161b': { name: 'Lutein', risk: 0 },
  'en:e162': { name: 'Beetroot Red', risk: 0 },
  'en:e163': { name: 'Anthocyanins', risk: 0 },
  'en:e170': { name: 'Calcium Carbonate', risk: 0 },
  'en:e171': { name: 'Titanium Dioxide', risk: 3 },
  'en:e172': { name: 'Iron Oxides', risk: 0 },

  // ─── PRESERVATIVES ───
  'en:e200': { name: 'Sorbic Acid', risk: 0 },
  'en:e201': { name: 'Sodium Sorbate', risk: 0 },
  'en:e202': { name: 'Potassium Sorbate', risk: 0 },
  'en:e210': { name: 'Benzoic Acid', risk: 2 },
  'en:e211': { name: 'Sodium Benzoate', risk: 2 },
  'en:e212': { name: 'Potassium Benzoate', risk: 2 },
  'en:e213': { name: 'Calcium Benzoate', risk: 2 },
  'en:e214': { name: 'Ethylparaben', risk: 2 },
  'en:e215': { name: 'Sodium Ethyl p-Hydroxybenzoate', risk: 2 },
  'en:e218': { name: 'Methylparaben', risk: 2 },
  'en:e220': { name: 'Sulphur Dioxide', risk: 2 },
  'en:e221': { name: 'Sodium Sulphite', risk: 2 },
  'en:e222': { name: 'Sodium Bisulphite', risk: 2 },
  'en:e223': { name: 'Sodium Metabisulphite', risk: 2 },
  'en:e224': { name: 'Potassium Metabisulphite', risk: 2 },
  'en:e226': { name: 'Calcium Sulphite', risk: 2 },
  'en:e227': { name: 'Calcium Bisulphite', risk: 2 },
  'en:e228': { name: 'Potassium Bisulphite', risk: 2 },
  'en:e230': { name: 'Biphenyl', risk: 3 },
  'en:e231': { name: 'Orthophenyl Phenol', risk: 3 },
  'en:e232': { name: 'Sodium Orthophenyl Phenol', risk: 3 },
  'en:e234': { name: 'Nisin', risk: 0 },
  'en:e235': { name: 'Natamycin', risk: 1 },
  'en:e239': { name: 'Hexamethylenetetramine', risk: 3 },
  'en:e242': { name: 'Dimethyl Dicarbonate', risk: 1 },
  'en:e249': { name: 'Potassium Nitrite', risk: 3 },
  'en:e250': { name: 'Sodium Nitrite', risk: 3 },
  'en:e251': { name: 'Sodium Nitrate', risk: 3 },
  'en:e252': { name: 'Potassium Nitrate', risk: 3 },
  'en:e260': { name: 'Acetic Acid', risk: 0 },
  'en:e261': { name: 'Potassium Acetate', risk: 0 },
  'en:e262': { name: 'Sodium Acetate', risk: 0 },
  'en:e263': { name: 'Calcium Acetate', risk: 0 },
  'en:e270': { name: 'Lactic Acid', risk: 0 },
  'en:e280': { name: 'Propionic Acid', risk: 1 },
  'en:e281': { name: 'Sodium Propionate', risk: 1 },
  'en:e282': { name: 'Calcium Propionate', risk: 1 },
  'en:e283': { name: 'Potassium Propionate', risk: 1 },
  'en:e290': { name: 'Carbon Dioxide', risk: 0 },
  'en:e296': { name: 'Malic Acid', risk: 0 },
  'en:e297': { name: 'Fumaric Acid', risk: 0 },

  // ─── ANTIOXIDANTS ───
  'en:e300': { name: 'Ascorbic Acid (Vitamin C)', risk: 0 },
  'en:e301': { name: 'Sodium Ascorbate', risk: 0 },
  'en:e302': { name: 'Calcium Ascorbate', risk: 0 },
  'en:e304': { name: 'Ascorbyl Palmitate', risk: 0 },
  'en:e306': { name: 'Tocopherols (Vitamin E)', risk: 0 },
  'en:e307': { name: 'Alpha-Tocopherol', risk: 0 },
  'en:e308': { name: 'Gamma-Tocopherol', risk: 0 },
  'en:e309': { name: 'Delta-Tocopherol', risk: 0 },
  'en:e310': { name: 'Propyl Gallate', risk: 2 },
  'en:e311': { name: 'Octyl Gallate', risk: 2 },
  'en:e312': { name: 'Dodecyl Gallate', risk: 2 },
  'en:e315': { name: 'Erythorbic Acid', risk: 0 },
  'en:e316': { name: 'Sodium Erythorbate', risk: 0 },
  'en:e319': { name: 'TBHQ', risk: 2 },
  'en:e320': { name: 'BHA (Butylated Hydroxyanisole)', risk: 3 },
  'en:e321': { name: 'BHT (Butylated Hydroxytoluene)', risk: 2 },
  'en:e322': { name: 'Lecithins', risk: 0 },
  'en:e325': { name: 'Sodium Lactate', risk: 0 },
  'en:e326': { name: 'Potassium Lactate', risk: 0 },
  'en:e327': { name: 'Calcium Lactate', risk: 0 },
  'en:e330': { name: 'Citric Acid', risk: 0 },
  'en:e331': { name: 'Sodium Citrate', risk: 0 },
  'en:e332': { name: 'Potassium Citrate', risk: 0 },
  'en:e333': { name: 'Calcium Citrate', risk: 0 },
  'en:e334': { name: 'Tartaric Acid', risk: 0 },
  'en:e335': { name: 'Sodium Tartrate', risk: 0 },
  'en:e336': { name: 'Potassium Tartrate', risk: 0 },
  'en:e337': { name: 'Sodium Potassium Tartrate', risk: 0 },
  'en:e338': { name: 'Phosphoric Acid', risk: 2 },
  'en:e339': { name: 'Sodium Phosphates', risk: 2 },
  'en:e340': { name: 'Potassium Phosphates', risk: 2 },
  'en:e341': { name: 'Calcium Phosphates', risk: 1 },
  'en:e343': { name: 'Magnesium Phosphates', risk: 1 },

  // ─── EMULSIFIERS / STABILISERS / THICKENERS ───
  'en:e400': { name: 'Alginic Acid', risk: 0 },
  'en:e401': { name: 'Sodium Alginate', risk: 0 },
  'en:e402': { name: 'Potassium Alginate', risk: 0 },
  'en:e406': { name: 'Agar', risk: 0 },
  'en:e407': { name: 'Carrageenan', risk: 2 },
  'en:e410': { name: 'Locust Bean Gum', risk: 0 },
  'en:e412': { name: 'Guar Gum', risk: 0 },
  'en:e414': { name: 'Gum Arabic', risk: 0 },
  'en:e415': { name: 'Xanthan Gum', risk: 0 },
  'en:e416': { name: 'Karaya Gum', risk: 0 },
  'en:e417': { name: 'Tara Gum', risk: 0 },
  'en:e418': { name: 'Gellan Gum', risk: 0 },
  'en:e420': { name: 'Sorbitol', risk: 1 },
  'en:e421': { name: 'Mannitol', risk: 1 },
  'en:e422': { name: 'Glycerol', risk: 0 },
  'en:e425': { name: 'Konjac', risk: 0 },
  'en:e426': { name: 'Soybean Hemicellulose', risk: 0 },
  'en:e427': { name: 'Cassia Gum', risk: 0 },
  'en:e432': { name: 'Polysorbate 20', risk: 2 },
  'en:e433': { name: 'Polysorbate 80', risk: 2 },
  'en:e434': { name: 'Polysorbate 40', risk: 2 },
  'en:e435': { name: 'Polysorbate 60', risk: 2 },
  'en:e436': { name: 'Polysorbate 65', risk: 2 },
  'en:e440': { name: 'Pectin', risk: 0 },
  'en:e442': { name: 'Ammonium Phosphatides', risk: 0 },
  'en:e450': { name: 'Diphosphates', risk: 2 },
  'en:e451': { name: 'Triphosphates', risk: 2 },
  'en:e452': { name: 'Polyphosphates', risk: 2 },
  'en:e460': { name: 'Cellulose', risk: 0 },
  'en:e461': { name: 'Methylcellulose', risk: 0 },
  'en:e462': { name: 'Ethylcellulose', risk: 0 },
  'en:e463': { name: 'Hydroxypropylcellulose', risk: 0 },
  'en:e464': { name: 'HPMC', risk: 0 },
  'en:e466': { name: 'Carboxymethylcellulose', risk: 1 },
  'en:e470a': { name: 'Sodium/Potassium/Calcium Fatty Acids', risk: 0 },
  'en:e470b': { name: 'Magnesium Fatty Acids', risk: 0 },
  'en:e471': { name: 'Mono- and Diglycerides', risk: 1 },
  'en:e472a': { name: 'Acetic Acid Esters of Mono/Diglycerides', risk: 0 },
  'en:e472b': { name: 'Lactic Acid Esters of Mono/Diglycerides', risk: 0 },
  'en:e472c': { name: 'Citric Acid Esters of Mono/Diglycerides', risk: 0 },
  'en:e472e': { name: 'DATEM', risk: 0 },
  'en:e473': { name: 'Sucrose Esters', risk: 1 },
  'en:e474': { name: 'Sucroglycerides', risk: 1 },
  'en:e475': { name: 'Polyglycerol Esters', risk: 1 },
  'en:e476': { name: 'Polyglycerol Polyricinoleate', risk: 1 },
  'en:e481': { name: 'Sodium Stearoyl Lactylate', risk: 0 },
  'en:e482': { name: 'Calcium Stearoyl Lactylate', risk: 0 },
  'en:e491': { name: 'Sorbitan Monostearate', risk: 1 },
  'en:e492': { name: 'Sorbitan Tristearate', risk: 1 },
  'en:e500': { name: 'Sodium Carbonates', risk: 0 },
  'en:e501': { name: 'Potassium Carbonates', risk: 0 },
  'en:e503': { name: 'Ammonium Carbonates', risk: 0 },
  'en:e504': { name: 'Magnesium Carbonates', risk: 0 },
  'en:e508': { name: 'Potassium Chloride', risk: 0 },
  'en:e509': { name: 'Calcium Chloride', risk: 0 },
  'en:e511': { name: 'Magnesium Chloride', risk: 0 },
  'en:e516': { name: 'Calcium Sulphate', risk: 0 },
  'en:e524': { name: 'Sodium Hydroxide', risk: 0 },
  'en:e551': { name: 'Silicon Dioxide', risk: 0 },
  'en:e553': { name: 'Talc', risk: 1 },
  'en:e554': { name: 'Sodium Aluminosilicate', risk: 2 },

  // ─── FLAVOUR ENHANCERS ───
  'en:e620': { name: 'Glutamic Acid', risk: 2 },
  'en:e621': { name: 'MSG (Monosodium Glutamate)', risk: 2 },
  'en:e622': { name: 'Monopotassium Glutamate', risk: 2 },
  'en:e623': { name: 'Calcium Glutamate', risk: 2 },
  'en:e624': { name: 'Monoammonium Glutamate', risk: 2 },
  'en:e625': { name: 'Magnesium Glutamate', risk: 2 },
  'en:e626': { name: 'Guanylic Acid', risk: 1 },
  'en:e627': { name: 'Disodium Guanylate', risk: 1 },
  'en:e631': { name: 'Disodium Inosinate', risk: 1 },
  'en:e635': { name: 'Disodium 5-Ribonucleotides', risk: 1 },
  'en:e640': { name: 'Glycine', risk: 0 },

  // ─── SWEETENERS ───
  'en:e420i': { name: 'Sorbitol', risk: 1 },
  'en:e421i': { name: 'Mannitol', risk: 1 },
  'en:e950': { name: 'Acesulfame K', risk: 2 },
  'en:e951': { name: 'Aspartame', risk: 3 },
  'en:e952': { name: 'Cyclamate', risk: 3 },
  'en:e953': { name: 'Isomalt', risk: 1 },
  'en:e954': { name: 'Saccharin', risk: 3 },
  'en:e955': { name: 'Sucralose', risk: 2 },
  'en:e957': { name: 'Thaumatin', risk: 0 },
  'en:e960': { name: 'Stevia / Steviol Glycosides', risk: 0 },
  'en:e961': { name: 'Neotame', risk: 2 },
  'en:e962': { name: 'Aspartame-Acesulfame Salt', risk: 3 },
  'en:e965': { name: 'Maltitol', risk: 1 },
  'en:e966': { name: 'Lactitol', risk: 1 },
  'en:e967': { name: 'Xylitol', risk: 1 },
  'en:e968': { name: 'Erythritol', risk: 0 },

  // ─── MISC ───
  'en:e170i': { name: 'Calcium Carbonate', risk: 0 },
  'en:e290i': { name: 'Carbon Dioxide', risk: 0 },
  'en:e322i': { name: 'Lecithins', risk: 0 },
  'en:e330i': { name: 'Citric Acid', risk: 0 },
  'en:e375': { name: 'Niacin', risk: 0 },
  'en:e392': { name: 'Rosemary Extract', risk: 0 },
  'en:e440a': { name: 'Pectin', risk: 0 },
  'en:e440i': { name: 'Pectin', risk: 0 },
  'en:e503i': { name: 'Ammonium Carbonate', risk: 0 },
  'en:e503ii': { name: 'Ammonium Hydrogen Carbonate', risk: 0 },
  'en:e500i': { name: 'Sodium Carbonate', risk: 0 },
  'en:e500ii': { name: 'Sodium Hydrogen Carbonate', risk: 0 },
  'en:e501i': { name: 'Potassium Carbonate', risk: 0 },
  'en:e524i': { name: 'Sodium Hydroxide', risk: 0 },
  'en:e551i': { name: 'Silicon Dioxide', risk: 0 },
  'en:e901': { name: 'Beeswax', risk: 0 },
  'en:e903': { name: 'Carnauba Wax', risk: 0 },
  'en:e904': { name: 'Shellac', risk: 0 },
  'en:e905': { name: 'Microcrystalline Wax', risk: 1 },
  'en:e912': { name: 'Montanic Acid Esters', risk: 1 },
  'en:e920': { name: 'L-Cysteine', risk: 1 },
  'en:e938': { name: 'Argon', risk: 0 },
  'en:e941': { name: 'Nitrogen', risk: 0 },
  'en:e942': { name: 'Nitrous Oxide', risk: 0 },
  'en:e943': { name: 'Butane / Isobutane', risk: 1 },
  'en:e948': { name: 'Oxygen', risk: 0 },
  'en:e999': { name: 'Quillaia Extract', risk: 1 },
  'en:e1100': { name: 'Amylase', risk: 0 },
  'en:e1101': { name: 'Protease', risk: 0 },
  'en:e1104': { name: 'Lipase', risk: 0 },
  'en:e1200': { name: 'Polydextrose', risk: 0 },
  'en:e1400': { name: 'Dextrin', risk: 0 },
  'en:e1401': { name: 'Acid-Treated Starch', risk: 0 },
  'en:e1404': { name: 'Oxidised Starch', risk: 0 },
  'en:e1410': { name: 'Monostarch Phosphate', risk: 0 },
  'en:e1412': { name: 'Distarch Phosphate', risk: 0 },
  'en:e1414': { name: 'Acetylated Distarch Phosphate', risk: 0 },
  'en:e1420': { name: 'Acetylated Starch', risk: 0 },
  'en:e1422': { name: 'Acetylated Distarch Adipate', risk: 0 },
  'en:e1442': { name: 'Hydroxypropyl Distarch Phosphate', risk: 0 },
  'en:e1450': { name: 'Sodium Starch Octenylsuccinate', risk: 0 },
  'en:e1451': { name: 'Acetylated Oxidised Starch', risk: 0 },
  'en:e1505': { name: 'Triethyl Citrate', risk: 0 },
  'en:e1518': { name: 'Glyceryl Triacetate', risk: 0 },
  'en:e1520': { name: 'Propylene Glycol', risk: 1 },
}

/**
 * Look up additive risk info by tag.
 * Open Food Facts uses tags like "en:e322" or "en:e322i".
 */
export function getAdditiveRisk(tag) {
  const normalized = tag.toLowerCase().trim()
  if (ADDITIVES[normalized]) return ADDITIVES[normalized]

  // Try without trailing roman numeral suffix (e.g., "en:e322i" → "en:e322")
  const base = normalized.replace(/[ivx]+$/, '')
  if (ADDITIVES[base]) return ADDITIVES[base]

  // Unknown additive — default to limited risk (caution)
  const eNum = normalized.replace('en:', '').toUpperCase()
  return { name: eNum, risk: 1 }
}

/**
 * Analyze a list of additive tags.
 * Returns: { additives: [{name, eNumber, risk, riskLabel, color}], totalPenalty, hasHighRisk, maxRisk }
 */
export function analyzeAdditives(additiveTags = []) {
  if (!additiveTags.length) {
    return { additives: [], totalPenalty: 0, hasHighRisk: false, maxRisk: 0 }
  }

  let totalPenalty = 0
  let hasHighRisk = false
  let maxRisk = 0

  const additives = additiveTags.map((tag) => {
    const info = getAdditiveRisk(tag)
    const penalty = RISK_PENALTIES[info.risk]
    totalPenalty += penalty
    if (info.risk === 3) hasHighRisk = true
    if (info.risk > maxRisk) maxRisk = info.risk

    return {
      tag,
      eNumber: tag.replace('en:', '').toUpperCase(),
      name: info.name,
      risk: info.risk,
      riskLabel: RISK_LABELS[info.risk],
      color: RISK_COLORS[info.risk],
      bgColor: RISK_BG_COLORS[info.risk],
      penalty,
    }
  })

  // Sort by risk level descending (worst first)
  additives.sort((a, b) => b.risk - a.risk)

  return { additives, totalPenalty, hasHighRisk, maxRisk }
}
