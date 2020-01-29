const way = require('senseway')
const scoreIncrement = require('./scoreIncrement')
const findIncrements = require('./findNextIncrement')

module.exports = (miFields, condChan) => {
  // Default increment.
  const increments = findIncrements(miFields, condChan)
  let bestAt = 0
  let bestScore

  increments.forEach((increment, i) => {
    const score = scoreIncrement(etc, increment)
    if (bestScore < score) {
      bestAt = i
    }
  })

  return increments[bestAt]
}
