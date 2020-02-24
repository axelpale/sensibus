const defaultState = {
  isRunning: false,
  progress: 0,
  progressMax: 0,
  confusion: {
    n: 0,
    truePos: 0,
    trueNeg: 0,
    falsePos: 0,
    falseNeg: 0
  },
  elapsedSeconds: 0
}

module.exports = (state, ev) => {
  if (!state.performance) {
    state = Object.assign({}, state, {
      performance: defaultState
    })
  }

  switch (ev.type) {
    case 'PERFORMANCE_BEGIN':
      return Object.assign({}, state, {
        performance: Object.assign({}, defaultState, {
          isRunning: true
        })
      })

    case 'PERFORMANCE_PROGRESS':
      return Object.assign({}, state, {
        performance: Object.assign({}, state.performance, {
          progress: ev.progress,
          progressMax: ev.progressMax,
          confusion: ev.confusion,
          elapsedSeconds: ev.elapsedSeconds
        })
      })

    case 'PERFORMANCE_END':
      return Object.assign({}, state, {
        performance: Object.assign({}, state.performance, {
          isRunning: false,
          progressMax: state.performance.progress
        })
      })

    case 'IMPORT_STATE':
    case 'RESET_STATE':
    case 'SELECT_PREDICTOR':
      return Object.assign({}, state, {
        performance: defaultState
      })

    default:
      return state
  }
}
