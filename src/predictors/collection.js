exports.predictors = {
  ratePredictor: require('./ratePredictor')
}

exports.getPredictor = (predictorName) => {
  return exports.predictors[predictorName]
}

exports.getSelectedPredictor = (state) => {
  const name = state.predictors.selection
  return exports.predictors[name]
}
