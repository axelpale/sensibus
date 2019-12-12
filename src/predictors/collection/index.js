exports.DEFAULT_PREDICTOR = 'channelMean'

exports.predictors = {
  channelMean: require('./channelMean')
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
