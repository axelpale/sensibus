exports.DEFAULT_PREDICTOR = 'channelMean'

exports.predictors = {
  fiftyFifty: require('./fiftyFifty'),
  copyPrevious: require('./copyPrevious'),
  channelMean: require('./channelMean'),
  naiveCorrelator: require('./naiveCorrelator'),
  naiveBayes: require('./naiveBayes'),
  filteredNaiveBayes: require('./filteredNaiveBayes')
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
  return exports.getPredictor(name)
}

exports.getSelectedModel = (state) => {
  const name = state.predictors.selection
  if (name in exports.predictors) {
    return state.predictors[name]
  } // else
  return state.predictors[exports.DEFAULT_PREDICTOR]
}

exports.has = (predictorId) => {
  return Object.prototype.hasOwnProperty.call(exports.predictors, predictorId)
}

exports.hibernate = (predictorId, model) => {
  const pr = exports.getPredictor(predictorId)
  return pr.hibernate(model)
}
