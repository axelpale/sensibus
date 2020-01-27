// Relevance.
// Relevance is computed for each channel and for each value.
// Sum mutual information between selected features and conditioning cell.
//
const way = require('senseway')

module.exports = (mutualInfoFields, condChan, subset) => {
  const condFrame = way.len(subset) - 1
  const miField = mutualInfoFields[condChan][condFrame]

  let relSum = 0
  let size = 0

  way.each(miField, (mi, xc, xt) => {
    if (subset[xc][xt] > 0 && !(condChan === xc && condFrame === xt)) {
      relSum += mi
      size += 1
    }
  })

  if (size > 0) {
    return relSum / size
  }

  return 0
}
