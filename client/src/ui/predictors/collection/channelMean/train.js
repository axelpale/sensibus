const way = require('senseway')

module.exports = (config, memory) => {
  // Trit mean. A bit different from traditional mean where every value
  // has equal weight. Trit mean can be viewed as a weighted average where
  // weight of a trit equals its absolute value. Beautiful.

  const sums = way.sums(memory)
  const sumsAbs = way.sumsAbs(memory)
  const channelMeans = way.map2(sums, sumsAbs, (a, b) => {
    return b > 0 ? a / b : 0
  }).map(m => m[0])

  return Object.assign({}, config, {
    channelMeans: channelMeans
  })
}
