const way = require('senseway')
const predictors = require('./index')

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

  const local = state.predictors

  const pr = predictors.getCurrent(state).reduce
  const oldPredictorState = local[local.selection]
  const nextPredictorState = pr(oldPredictorState, state.timeline.way, ev)

  if (nextPredictorState !== oldPredictorState) {
    // Copy probabilties from the local state to ease read for timeline render.
    const part = {}
    part[local.selection] = nextPredictorState
    part.prediction = nextPredictorState.prediction

    return Object.assign({}, state, {
      predictors: Object.assign({}, local, part)
    })
  }

  // No changes
  return state
}
