const scoreIncrement = require('./scoreIncrement')
const findIncrements = require('./findIncrements')

module.exports = (priors, fields, miFields, slices, condChan) => {
  // Default increment.
  const increments = findIncrements(miFields, condChan)
  let bestAccuracy = 0
  let bestAt = 0

  increments.forEach((increment, i) => {
    const accuracy = scoreIncrement(priors, fields, slices, condChan, increment)
    if (bestAccuracy < accuracy) {
      bestAccuracy = accuracy
      bestAt = i
    }
  })

  return {
    increments: increments,
    bestAt: bestAt
  }
}
