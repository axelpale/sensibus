exports.DEFAULT_PREDICTOR = 'channelMean'

exports.predictors = {
  channelMean: require('./channelMean')
}

exports.getPredictor = (predictorName) => {
  return exports.predictors[predictorName]
}

exports.getSelectedPredictor = (state) => {
  const name = state.predictors.selection
  return exports.predictors[name]
}
