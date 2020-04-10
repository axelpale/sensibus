// Redundancy.
// Average mutual information between selected features.
//
const way = require('senseway')

module.exports = (mutualInfoFields, subset, candidateCell) => {
  // Compute average mutual information between c-cell and subset cells.
  // Assert: candidateCell not in subset

  const xc = candidateCell.channel
  const xt = candidateCell.time
  const miField = mutualInfoFields[xc][xt]

  let redSum = 0
  let redSize = 0

  way.each(miField, (mi, yc, yt) => {
    if (subset[yc][yt] > 0) {
      redSum += mi
      redSize += 1
    }
  })

  if (redSize > 0) {
    // At least one possibly redundant cell found.
    return redSum / redSize
  }

  // Empty subset. No cell in the subset is redundant with the candidate.
  // Return least redundancy.
  return 0
}
