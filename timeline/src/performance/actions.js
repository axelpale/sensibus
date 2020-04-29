const Runner = require('./runner.worker.js')

let perfRunner

exports.run = (state, dispatch) => {
  // Leave-one-out cross-validation:
  // For each known value
  //   clone the memory but set the known value to 0
  //   make prediction
  //   compare prediction to the known value

  dispatch({
    type: 'PERFORMANCE_BEGIN'
  })

  perfRunner = new Runner()

  perfRunner.onmessage = (ev) => {
    // Worker message; a cross validation fold
    dispatch({
      type: 'PERFORMANCE_PROGRESS',
      progress: ev.data.progress,
      progressMax: ev.data.progressMax,
      confusion: ev.data.confusion,
      elapsedSeconds: ev.data.elapsedSeconds
    })

    if (ev.data.progress >= ev.data.progressMax) {
      perfRunner.terminate()

      dispatch({
        type: 'PERFORMANCE_END'
      })
    }
  }

  // Begin the run
  const currentId = state.predictors.currentId
  perfRunner.postMessage({
    memory: state.timeline.memory,
    predictorId: currentId,
    predictorConfig: state.predictors[currentId]
  })
}

exports.stop = (state, dispatch) => {
  perfRunner.terminate()

  dispatch({
    type: 'PERFORMANCE_END'
  })
}
