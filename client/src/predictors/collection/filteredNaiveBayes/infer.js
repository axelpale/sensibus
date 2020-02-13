const way = require('senseway')
const lib = require('./lib')
const inference = require('./inference')

module.exports = (model, cell, memory) => {
  const ctxBegin = lib.getBegin(model, cell.time)
  const ctxEnd = lib.getEnd(model, cell.time)
  const context = way.slice(memory, ctxBegin, ctxEnd)

  const inferResult = inference.infer(
    model.priors[cell.channel],
    model.fields[cell.channel],
    model.weights[cell.channel],
    context
  )

  // For backward-compatibility, add cell
  inferResult.cell = cell

  return inferResult
}
