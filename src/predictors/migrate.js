const collection = require('./collection')

module.exports = (local) => {
  const nextLocal = {}

  // If predictor name is deprecated
  if (collection.has(local.selection)) {
    nextLocal.selection = local.selection
  } else {
    nextLocal.selection = collection.DEFAULT_PREDICTOR
  }

  // If predictor states are deprectated
  collection.getPredictorIds().forEach(prid => {
    // Hibernate state of those predictors that have set a state.
    const model = local[prid]
    if (model) {
      nextLocal[prid] = model
    }
  })

  return nextLocal
}
