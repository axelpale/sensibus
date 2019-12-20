const run = require('./run')

const defaultResults = {
  numTrainingSets: 0,
  truePos: 0,
  trueNeg: 0,
  falsePos: 0,
  falseNeg: 0,
  score: 0
}

module.exports = (state, ev) => {
  if (!state.performance) {
    state = Object.assign({}, state, {
      performance: defaultResults
    })
  }

  switch (ev.type) {
    case 'RUN_PERFORMANCE_TEST':
      return Object.assign({}, state, {
        performance: run(state)
      })

    case 'IMPORT_STATE':
    case 'RESET_STATE':
    case 'SELECT_PREDICTOR':
      return Object.assign({}, state, {
        performance: defaultResults
      })

    default:
      return state
  }
}
