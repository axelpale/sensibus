const way = require('senseway')
const patmean = require('./mean')
const patFindMatches = require('./findMatches')

module.exports = (history, pattern) => {
  // Sum over places in history where the pattern exists.
  //
  // Params:
  //   history, a pat. Full history where to search the pattern.
  //   pattern, a pat. The pattern to find.
  //

  const matchPats = patFindMatches(history, pattern)

  // We will add up the matching parts of the history to see what
  // happens around the pattern. Let us init the sum with zeros.
  let ctxValueSum = way.map(pattern.value, q => 0)
  let ctxMassSum = way.map(pattern.value, q => 0)

  matchPats.forEach(match => {
    const val = way.map2(match.value, match.mass, (v, m) => (m > 0) ? v : 0)
    ctxValueSum = way.add(ctxValueSum, val)
    ctxMassSum = way.add(ctxMassSum, match.mass)
  })

  // Normalise to get the average value.
  const prior = patmean(history)
  let ctxAverage = way.map2(ctxValueSum, ctxMassSum, (v, m, c) => {
    // Take care of possible division by zero.
    // These cells have no evidence from matches.
    return m > 0 ? v / m : prior.value[c][0]
  })

  return {
    value: ctxAverage,
    mass: ctxMassSum
  }
}
