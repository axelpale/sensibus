const way = require('senseway')
const predictorSelector = require('./predictorSelector/reduce')
const collection = require('./collection')

const delegate = (state, ev) => {
  // Delegate event to the selected predictor.
  //
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

  state = predictorSelector(state, ev)

  switch (ev.type) {
    case '__INIT__':
    case 'EDIT_CELL':
    case 'CREATE_CHANNEL':
    case 'MOVE_CHANNEL':
    case 'REMOVE_CHANNEL':
    case 'CREATE_FRAME':
    case 'MOVE_FRAME':
    case 'REMOVE_FRAME':
      return delegate(state, ev)

    default:
      return state
  }
}
