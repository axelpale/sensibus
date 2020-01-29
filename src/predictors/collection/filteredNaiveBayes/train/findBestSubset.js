const way = require('senseway')
const findNextIncrement = require('./findNextIncrement')

module.exports = (miFields, condChan) => {
  // Default increment.
  const increments = [findNextIncrement(miFields, condChan, null)]
  let bestAt = 0

  // Limit search to number of features
  const maxIncrements = way.size(miFields)

  while (increments.length <= maxIncrements) {
    const prevIncrement = increments[increments.length - 1]
    const prevSubset = prevIncrement.subset
    const bestIncrement = findNextIncrement(miFields, condChan, prevSubset)

    if (bestIncrement === null) {
      // No increment found
      break
    }

    if (prevIncrement.score < bestIncrement.score) {
      // Increment was better. Continue search.
      increments.push(bestIncrement)
      bestAt = increments.length - 1
    } else if (prevIncrement.score === bestIncrement.score) {
      // Increment was equally good. Continue search but prefer
      // the smallest equally good set in the end.
      increments.push(bestIncrement)
    } else {
      // Increment was worse. Save the increment for inspection
      // but terminate the search.
      increments.push(bestIncrement)
      break
    }
  }

  return {
    increments: increments,
    bestAt: bestAt
  }
}
