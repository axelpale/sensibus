exports.DEFAULT_PREDICTOR = 'channelMean'

exports.predictors = {
  channelMean: require('./channelMean'),
  naiveCorrelator: require('./naiveCorrelator'),
  weightedNaiveCorrelator: require('./weightedNaiveCorrelator'),
  naiveBayes: require('./naiveBayes'),
  firstOrder: require('./firstOrder')
}

exports.getPredictor = (predictorName) => {
  const p = exports.predictors[predictorName]
  if (p) {
    return p
  }
  return exports.predictors[exports.DEFAULT_PREDICTOR]
}

exports.getSelectedPredictor = (state) => {
  const name = state.predictors.selection
  return exports.predictors[name]
}

exports.getSelectedLocalState = (state) => {
  const name = state.predictors.selection
  return state.predictors[name]
}
