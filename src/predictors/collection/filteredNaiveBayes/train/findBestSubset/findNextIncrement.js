const way = require('senseway')
const getRedundancy = require('./getRedundancy')
const getRelevance = require('./getRelevance')

// Incremental search.
// Repeatedly find (c,t) in candidate set that maximises mRMR.
module.exports = (miFields, condChan, subset) => {
  if (!subset) {
    // Initial increment when subset null
    return {
      score: -1,
      subset: way.fill(miFields, 0),
      redundancy: 1,
      relevance: 0,
      candidateRedundancies: way.fill(miFields, 1),
      candidateRelevances: way.fill(miFields, 0)
    }
  }

  let bestScore = -1 // what is theoretical min?
  let bestRedundancy = 1
  let bestRelevance = 0
  let bestSubset = null

  // Try all cells that are not selected (value === 0).
  // Go through selected features in way.map(subset, q => 1 - q)
  const candidateCells = way.toArray(subset).filter(cell => cell.value === 0)

  // Redundacies and relevances of candidates
  // for understanding and visualisation,
  const redundancyField = way.fill(subset, 0)
  const relevanceField = way.fill(subset, 0)

  candidateCells.forEach(cell => {
    const candidateSubset = way.set(subset, cell.channel, cell.time, 1)
    const redundancy = getRedundancy(miFields, candidateSubset)
    const relevance = getRelevance(miFields, condChan, candidateSubset)
    const score = relevance - redundancy

    if (score > bestScore) {
      bestScore = score
      bestRedundancy = redundancy
      bestRelevance = relevance
      bestSubset = candidateSubset
    }

    redundancyField[cell.channel][cell.time] = redundancy
    relevanceField[cell.channel][cell.time] = relevance
  })

  if (bestSubset) {
    return {
      score: bestScore,
      subset: bestSubset,
      redundancy: bestRedundancy,
      relevance: bestRelevance,
      candidateRedundancies: redundancyField,
      candidateRelevances: relevanceField
    }
  }

  // No increment found
  return null
}
