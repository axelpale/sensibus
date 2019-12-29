const collection = require('./collection')

module.exports = (local) => {
  const nextLocal = {
    selection: local.selection
  }

  collection.getPredictorIds().forEach(prid => {
    // Hydrate state of those predictors that have set a state.
    const model = local[prid]
    if (model) {
      nextLocal[prid] = collection.hydrate(prid, model)
    }
  })

  return nextLocal
}
