const way = require('senseway')
const infer = require('./infer')
const lib = require('./lib')

module.exports = (model, memory) => {
  // - Predict unknowns by using the priors and conditional fields.
  // - Apply dynamic programming method and include every predicted cell
  //   into the context of the next prediction.
  // - The computation order is important.
  //   The heavier the context, the better the estimate.
  const cells = way.toTimeOrderedArray(memory)
  // OPTIMIZE start search from the middle and avoid going far to light areas.
  const firstCell = cells.reduce((acc, cell, i) => {
    const begin = lib.getBegin(model, cell.time)
    const end = lib.getEnd(model, cell.time)
    const context = way.slice(memory, begin, end)
    const weight = way.sumAbs(context)
    if (weight > acc.weight) {
      return Object.assign({}, cell, {
        weight: weight,
        index: i
      })
    }
    return acc
  }, { weight: -1 })
  // First up, then down from the first cell.
  const orderedCells = [].concat(
    cells.slice(0, firstCell.index + 1).reverse(),
    cells.slice(firstCell.index + 1)
  )
  // Now unknowns are ordered so that we can predict them dynamically.
  // We need to place the predictions in somewhere.
  // We place the predictions into 'virtual memory'.
  const virtual = way.clone(memory)

  // Predict every unknown cell
  const cellResults = orderedCells.map(cell => {
    const result = infer(model, cell, virtual)
    // Insert prediction into the virtual memory to boost next predictions.
    // Insert only if the original value was unknown, because
    // otherwise false predictions would mess things up.
    if (cell.value === 0) {
      virtual[cell.channel][cell.time] = result.prediction
    }
    return result
  })

  return {
    prediction: virtual,
    cellResults: cellResults
  }
}
