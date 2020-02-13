const way = require('senseway')
const infer = require('./infer')

module.exports = (model, memory) => {
  // Predict unknowns using the fields.
  // Simple approach: fiels look mostly back.
  // Use single field to check how much it agrees with context.
  // Simple multiply-accumulate is what we need.
  const cellResults = way.toArray(memory).map(cell => {
    const result = infer(model, cell, memory)
    return result
  })

  // Lay predictions on a memory-shaped way
  const predictedMemory = cellResults.reduce((mem, pred) => {
    const c = pred.cell.channel
    const t = pred.cell.time
    mem[c][t] = pred.prediction
    return mem
  }, way.fill(memory, 0))

  return {
    prediction: predictedMemory,
    cellResults: cellResults
  }
}
