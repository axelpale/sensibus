exports.predictors = {
  ratePredictor: require('./ratePredictor')
}

exports.getCurrent = (state) => {
  const name = state.predictors.selection
  return exports.predictors[name]
}
