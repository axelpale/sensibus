const scoreIncrement = require('./scoreIncrement')
const findIncrements = require('./findIncrements')

module.exports = (priors, fields, miFields, slices, condChan) => {
  // Default increment.
  const increments = findIncrements(miFields, condChan)
  let bestAccuracy = 0
  let bestAt = 0

  const scores = increments.map((increment, i) => {
    const accuracy = scoreIncrement(priors, fields, slices, condChan, increment)
    if (bestAccuracy < accuracy) {
      bestAccuracy = accuracy
      bestAt = i
    }
    return accuracy
  })

  return {
    increments: increments,
    scores: scores,
    bestAt: bestAt
  }
}
