const way = require('senseway')
const findNextIncrement = require('./findNextIncrement')

module.exports = (miFields, condChan) => {
  const increments = [findNextIncrement(miFields, condChan, null)]

  // Limit search to the number of features
  const maxIncrements = way.size(miFields)

  while (increments.length <= maxIncrements) {
    const prevIncrement = increments[increments.length - 1]
    const prevSubset = prevIncrement.subset
    const nextIncrement = findNextIncrement(miFields, condChan, prevSubset)

    if (nextIncrement === null) {
      // No increment found
      break
    }

    increments.push(nextIncrement)
  }

  return increments
}
