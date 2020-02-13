const way = require('senseway')
const lib = require('./lib')

module.exports = (model, cell, memory) => {
  const begin = lib.getBegin(model, cell.time)
  const end = lib.getEnd(model, cell.time)
  const context = way.slice(memory, begin, end)

  const valueField = model.fields[cell.channel].valueField
  const sumAbsField = model.fields[cell.channel].sumAbsField
  const matches = way.multiply(context, valueField) // support for hypo u=1

  const matchSum = way.reduce(matches, (acc, match, c, t) => {
    return acc + match
  }, 0)
  const absMatchSum = way.reduce(matches, (acc, match, c, t) => {
    return acc + Math.abs(match)
  }, 0)

  const prediction = (absMatchSum > 0 ? matchSum / absMatchSum : 0)

  return {
    cell: cell,
    context: context,
    prediction: prediction,
    mass: way.sum(sumAbsField), // sample size
    matchSum: matchSum,
    absMatchSum: absMatchSum
  }
}
