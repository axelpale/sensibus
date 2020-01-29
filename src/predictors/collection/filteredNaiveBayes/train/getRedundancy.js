// Redundancy.
// Average mutual information between selected features.
//
const way = require('senseway')

module.exports = (mutualInfoFields, subset) => {
  let subsetSize = 0
  let redSum = 0
  let redSize = 0

  // For each pair of selected features, compute average mutual information.
  // Avoid summation of self-redundancies because I(X;X) >= I(X;Y).
  // OPTIMIZE by noting that all is summed twice.
  way.each(mutualInfoFields, (miField, yc, yt) => {
    if (subset[yc][yt] > 0) {
      way.each(miField, (mi, xc, xt) => {
        if (subset[xc][xt] > 0) {
          subsetSize += 1
          if (!(yc === xc && yt === xt)) {
            redSum += mi
            redSize += 1
          }
        }
      })
    }
  })

  if (redSize > 0) {
    // At least one pair where X != Y found.
    return redSum / redSize
  }

  if (subsetSize > 0) {
    // No pairs found but subset still has non-zero elements.
    // => subsetSize == 1. Single-feature subsets have redundancy 0.
    return 0
  }

  // All subset elements zero. Return the worst redundancy.
  return 1
}
