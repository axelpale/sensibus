const collection = require('./collection')

module.exports = (local) => {
  const nextLocal = {
    currentId: local.currentId
  }

  collection.getPredictorIds().forEach(prid => {
    // Hibernate state of those predictors that have set a state.
    const model = local[prid]
    if (model) {
      nextLocal[prid] = collection.hibernate(prid, model)
    }
  })

  return nextLocal
}
