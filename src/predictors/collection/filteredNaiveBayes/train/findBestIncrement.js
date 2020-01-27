const way = require('senseway')
const getRedundancy = require('./getRedundancy')
const getRelevance = require('./getRelevance')

// Incremental search.
// Repeatedly find (c,t) in candidate set that maximises mRMR.
module.exports = (miFields, condChan, subset) => {
  let bestScore = 0
  let bestSubset = subset

  // Try all cells that are not selected (value === 0).
  // Go through selected features in way.map(subset, q => 1 - q)
  way.toArray(subset).filter(cell => cell.value === 0).forEach(cell => {
    const candidateSubset = way.set(subset, cell.channel, cell.frame, 1)
    const redundancy = getRedundancy(miFields, candidateSubset)
    const relevance = getRelevance(miFields, condChan, candidateSubset)
    const score = relevance - redundancy

    if (score > bestScore) {
      bestScore = score
      bestSubset = candidateSubset
    }
  })

  return {
    score: bestScore,
    subset: bestSubset
  }
}
