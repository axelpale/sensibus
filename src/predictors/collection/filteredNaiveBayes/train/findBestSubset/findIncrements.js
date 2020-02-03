const way = require('senseway')
const findNextIncrement = require('./findNextIncrement')

module.exports = (miFields, condChan) => {
  const increments = [findNextIncrement(miFields, condChan, null)]

  // Limit search to number of features
  const maxIncrements = 20 // way.size(miFields)

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

  // DEBUG maximal increment
  const maximalSubset = way.fill(miFields, 1)
  const subMaxSubset = way.set(maximalSubset, 0, 0, 0)
  const maximalIncrement = findNextIncrement(miFields, condChan, subMaxSubset)

  increments.push(maximalIncrement)

  return increments
}
