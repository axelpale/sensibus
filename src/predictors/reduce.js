const way = require('senseway')

const predictors = {
  ratePredictor: require('./ratePredictor/reduce')
}

module.exports = (state, ev) => {
  // Default
  if (!state.predictors) {
    state = Object.assign({}, state, {
      predictors: {
        selection: 'ratePredictor',
        prediction: way.fill(state.timeline.way, 0),
        ratePredictor: {}
      }
    })
  }

  const pr = predictors[state.predictors.selection]
  const oldPredictorState = state.predictors[state.predictors.selection]
  const nextPredictorState = pr(oldPredictorState, state.timeline.way, ev)

  if (nextPredictorState !== oldPredictorState) {
    // Copy prediction from the local state to ease read for timeline render.
    const part = {}
    part[state.predictors.selection] = nextPredictorState
    part.prediction = nextPredictorState.prediction

    return Object.assign({}, state, {
      predictors: Object.assign({}, state.predictors, part)
    })
  }

  // No changes
  return state
}
