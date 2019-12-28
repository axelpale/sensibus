const way = require('senseway')
const predictorSelector = require('./predictorSelector/reduce')
const collection = require('./collection')

const delegate = (state, ev) => {
  // Delegate event to the selected predictor.
  // Create a state branch for the selector if one does not yet exist.
  //
  const memory = state.timeline.memory
  const selection = state.predictors.selection

  const reducer = collection.getPredictor(selection).reduce
  const oldPredictorState = state.predictors[selection] // can be undefined
  const nextPredictorState = reducer(oldPredictorState, memory, ev)

  if (nextPredictorState !== oldPredictorState) {
    // Copy probabilties from the local state to ease read for timeline render.
    const update = {}
    update[selection] = nextPredictorState
    update.prediction = nextPredictorState.prediction

    return Object.assign({}, state, {
      predictors: Object.assign({}, state.predictors, update)
    })
  }

  // Else no changes
  return state
}

module.exports = (state, ev) => {
  // Default
  if (!state.predictors) {
    state = Object.assign({}, state, {
      predictors: {
        selection: collection.DEFAULT_PREDICTOR,
        prediction: way.fill(state.timeline.memory, 0)
      }
    })
  }

  // Call selector reducer and then predictor reducer
  state = predictorSelector(state, ev)
  state = delegate(state, ev)

  return state
}
