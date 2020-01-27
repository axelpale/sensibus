const way = require('senseway')
const getRedundancy = require('./getRedundancy')
const getRelevance = require('./getRelevance')

// Incremental search.
// Repeatedly find (c,t) in candidate set that maximises mRMR.
module.exports = (miFields, condChan, subset) => {
  let bestScore = -1 // what is theoretical min?
  let bestRedundancy = 1
  let bestRelevance = 0
  let bestSubset = null

  // Try all cells that are not selected (value === 0).
  // Go through selected features in way.map(subset, q => 1 - q)
  const candidateCells = way.toArray(subset).filter(cell => cell.value === 0)

  // For understanding and visualisation,
  const mrmrField = way.fill(subset, -1)

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

    mrmrField[cell.channel][cell.time] = score
  })

  if (bestSubset) {
    return {
      score: bestScore,
      subset: bestSubset,
      redundancy: bestRedundancy,
      relevance: bestRelevance,
      mrmrField: mrmrField
    }
  }

  // No increment found
  return null
}
