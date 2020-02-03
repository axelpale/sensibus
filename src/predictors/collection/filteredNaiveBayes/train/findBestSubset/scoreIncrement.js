const way = require('senseway')
const problib = require('problib')
const inference = require('../../inference')

module.exports = (priors, fields, slices, condChan, increment) => {
  const len = way.len(slices[0])

  const prior = priors[condChan]
  const field = fields[condChan]
  const weight = increment.subset

  const confusion = slices.reduce((acc, slice) => {
    const actualValue = slice[condChan][len - 1]

    // Skip slices where actual value is not known.
    if (actualValue === 0) {
      return acc
    }

    const context = way.set(slice, condChan, len - 1, 0)
    const prediction = inference.infer(prior, field, weight, context)
    const predicted = (1 + prediction.prediction) / 2 // trit to prob
    const actual = (1 + actualValue) / 2 // trit to prob

    acc.truePos += predicted * actual
    acc.trueNeg += (1 - predicted) * (1 - actual)
    acc.falsePos += predicted * (1 - actual)
    acc.falseNeg += (1 - predicted) * actual // predict neg but actually pos
    return acc
  }, {
    truePos: 0,
    trueNeg: 0,
    falsePos: 0,
    falseNeg: 0
  })

  return problib.mcc(confusion)
}
