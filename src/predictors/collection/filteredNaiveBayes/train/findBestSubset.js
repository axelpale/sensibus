const way = require('senseway')
const findBestIncrement = require('./findBestIncrement')

module.exports = (miFields, condChan) => {
  const increments = [{
    score: 0,
    subset: way.fill(miFields, 0)
  }]
  let bestAt = 0

  // Limit search to number of features
  const maxIncrements = way.size(miFields)

  while (increments.length <= maxIncrements) {
    const prevIncrement = increments[increments.length - 1]
    const prevSubset = prevIncrement.subset
    const bestIncrement = findBestIncrement(miFields, condChan, prevSubset)

    if (prevSubset.score < bestIncrement.score) {
      // Increment was better. Continue search.
      increments.push(bestIncrement)
      bestAt = increments.length - 1
    } else if (prevSubset.score === bestIncrement.score) {
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
