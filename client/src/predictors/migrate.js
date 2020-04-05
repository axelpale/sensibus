const collection = require('./collection')
const way = require('senseway')

module.exports = (state) => {
  let predictors = state.predictors

  if (!predictors) {
    predictors = {}
  }

  // If predictor name is deprecated
  let currentId
  if (predictors.currentId && collection.has(predictors.currentId)) {
    currentId = predictors.currentId
  } else {
    currentId = collection.DEFAULT_PREDICTOR
  }
  predictors = Object.assign({}, predictors, {
    currentId: currentId
  })

  // If virtual memory is missing
  if (!predictors.prediction) {
    const memory = state.timeline.memory
    predictors = Object.assign({}, predictors, {
      prediction: way.fill(memory, 0)
    })
  }

  return Object.assign({}, state, {
    predictors: predictors
  })
}
