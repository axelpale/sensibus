const scoreIncrement = require('./scoreIncrement')
const findIncrements = require('./findIncrements')

module.exports = (priors, fields, miFields, slices, condChan) => {
  // Default increment.
  const increments = findIncrements(miFields, condChan)
  let bestScore = -1 // min MCC score
  let bestAt = 0

  const scorings = increments.map((increment, i) => {
    const scoring = scoreIncrement(priors, fields, slices, condChan, increment)
    if (bestScore < scoring.score) {
      bestScore = scoring.score
      bestAt = i
    }
    return scoring
  })

  return {
    increments: increments,
    scorings: scorings,
    bestAt: bestAt
  }
}
