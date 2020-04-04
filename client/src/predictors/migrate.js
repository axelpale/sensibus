const collection = require('./collection')

module.exports = (local) => {
  if (!local) {
    local = {}
  }
  const nextLocal = {}

  // If predictor name is deprecated
  if (local.currentId && collection.has(local.currentId)) {
    nextLocal.currentId = local.currentId
  } else {
    nextLocal.currentId = collection.DEFAULT_PREDICTOR
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
