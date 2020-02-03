const way = require('senseway')
const getRedundancy = require('./getRedundancy')
const getRelevance = require('./getRelevance')

// Incremental search.
// Repeatedly find (c,t) in candidate set that maximises Rel-Red.
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
  let bestCell = null

  // Conditioning cell
  const condFrame = way.len(miFields) - 1

  // Try all cells that are not already selected i.e. with value of 0.
  // Do not try the conditioning cell.
  const candidateCells = way.toArray(subset)
    .filter(cell => cell.value === 0)
    .filter(cell => !(cell.channel === condChan && cell.time === condFrame))

  // Collect redundacies and relevances of candidates
  // for understanding and visualisation,
  const relevanceField = way.fill(subset, 0)
  const redundancyField = way.fill(subset, 0)

  candidateCells.forEach(cell => {
    // A candidate subset consists of the current subset and a candidate cell.
    // We should evaluate redundancy and relevance of the candidate subset.
    // However, only evaluating redundancy and relevance of the candidate cell
    // is sufficient because other values remain the same regardless the cell.
    // See Peng-Long-Ding 2005, Eq 7.

    const relevance = getRelevance(miFields, condChan, cell)
    const redundancy = getRedundancy(miFields, subset, cell)
    const score = relevance - redundancy

    if (score > bestScore) {
      bestScore = score
      bestRelevance = relevance
      bestRedundancy = redundancy
      bestCell = cell
    }

    relevanceField[cell.channel][cell.time] = relevance
    redundancyField[cell.channel][cell.time] = redundancy
  })

  if (bestCell) {
    return {
      score: bestScore,
      subset: way.set(subset, bestCell.channel, bestCell.time, 1),
      redundancy: bestRedundancy,
      relevance: bestRelevance,
      candidateRedundancies: redundancyField,
      candidateRelevances: relevanceField
    }
  }

  // No increment found
  return null
}
