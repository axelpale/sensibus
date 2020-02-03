// Relevance.
// Relevance is computed for each channel and for each value.
// Sum mutual information between selected features and conditioning cell.
//
const way = require('senseway')

module.exports = (mutualInfoFields, condChan, candidateCell) => {
  // Assert: candidate cell is not the conditioning cell.
  const condFrame = way.len(mutualInfoFields) - 1
  const miField = mutualInfoFields[condChan][condFrame]

  const xc = candidateCell.channel
  const xt = candidateCell.time
  return miField[xc][xt]
}
