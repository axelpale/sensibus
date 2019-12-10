
exports.reduce = require('./reduce')
exports.render = require('./render')
exports.predict = require('./predict')

exports.getLocal = (state) => {
  return state.predictors.ratePredictor
}
