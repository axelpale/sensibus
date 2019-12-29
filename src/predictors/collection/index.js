exports.DEFAULT_PREDICTOR = 'channelMean'

exports.predictors = {
  fiftyFifty: require('./fiftyFifty'),
  channelMean: require('./channelMean'),
  naiveCorrelator: require('./naiveCorrelator'),
  dynamicNaiveBayes: require('./dynamicNaiveBayes'),
  firstOrder: require('./firstOrder')
}

exports.getPredictorIds = () => {
  return Object.keys(exports.predictors)
}

exports.getPredictor = (predictorId) => {
  const p = exports.predictors[predictorId]
  if (p) {
    return p
  }
  return exports.predictors[exports.DEFAULT_PREDICTOR]
}

exports.getSelectedPredictor = (state) => {
  const name = state.predictors.selection
  return exports.predictors[name]
}

exports.getSelectedModel = (state) => {
  const name = state.predictors.selection
  return state.predictors[name]
}

exports.hydrate = (predictorId, model) => {
  return exports.predictors[predictorId].hydrate(model)
}
