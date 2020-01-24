const way = require('senseway')

module.exports = (mutualInfoFields, subset) => {
  let redSum = 0
  let size = 0

  // OPTIMIZE by noting that all is summed twice.
  way.each(mutualInfoFields, (miField, yc, yt) => {
    if (subset[yc][yt] > 0) {
      way.each(miField, (mi, xc, xt) => {
        if (subset[xc][xt] > 0) {
          redSum += mi
          size += 1
        }
      })
    }
  })

  if (size > 0) {
    return redSum / size
  }

  return 1
}
