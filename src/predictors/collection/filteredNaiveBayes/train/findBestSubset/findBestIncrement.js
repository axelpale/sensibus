const scoreIncrement = require('./scoreIncrement')
const findIncrements = require('./findIncrements')

module.exports = (priors, fields, miFields, slices, condChan) => {
  // Default increment.
  const increments = findIncrements(miFields, condChan)
  let bestScore = -1 // min MCC score
  let bestAt = 0

  const scores = increments.map((increment, i) => {
    const score = scoreIncrement(priors, fields, slices, condChan, increment)
    if (bestScore < score) {
      bestScore = score
      bestAt = i
    }
    return score
  })

  return {
    increments: increments,
    scores: scores,
    bestAt: bestAt
  }
}
