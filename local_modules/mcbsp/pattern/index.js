const way = require('senseway')
const informationGain = require('./informationGain')
exports.averageContext = require('./averageContext')

const firstOrder = require('./firstOrder')
exports.firstOrderPatterns = firstOrder.patterns
exports.firstOrderPredict = firstOrder.predict

const secondOrder = require('./secondOrder')
exports.secondOrderPatterns = secondOrder.patterns
exports.secondOrderPredict = secondOrder.predict

exports.dependent = (history, values, mask) => {
  const averageContext = exports.averageContext(history, values, mask)
  const prior = way.mean(history)
  return informationGain(prior, averageContext.values)
}

// TODO
// mutualInformation (history, patternA, patternB)
// pointwiseMutualInformation (history, patternA, patternB)
