const way = require('senseway')
const collection = require('./collection')

module.exports = (state, ev) => {
  // Default
  if (!state.predictors) {
    state = Object.assign({}, state, {
      predictors: {
        current: 'ratePredictor',
        prediction: way.fill(state.timeline.way, 0),
        ratePredictor: {}
      }
    })
  }

  const memory = state.timeline.way
  const selection = state.predictors.selection

  const reducer = collection.getPredictor(selection).reduce
  const oldPredictorState = state.predictors[selection]
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
