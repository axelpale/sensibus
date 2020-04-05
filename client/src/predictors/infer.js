const way = require('senseway')
const eachSeries = require('async/eachSeries')

const MAX_TIME_DISTANCE = 7

const runner = {
  // The prediction is executed cell by cell.
  // The prediction is wrapped in a runner for easy cancelling.
  stop: () => {},
  start: function (cells, dispatch) {
    // Stop previous run.
    runner.stop()
    let stopped = false
    console.log('start run')

    // Begin new run.
    // Predict cells one by one
    eachSeries(cells, (cell, then) => {
      dispatch({
        type: 'INFER_ONE',
        cell: cell
      })

      if (!stopped) {
        setTimeout(then, 10)
      } else {
        then('stop') // Hacky. Provide error string to stop execution.
      }
    }, (err) => {
      if (err) {
        if (err === 'stop') {
          return
        }
        return console.error(err)
      }
      console.log('run finished')
    })

    runner.stop = function () {
      console.log('run stopped')
      stopped = true
    }
  }
}

module.exports = (store, dispatch) => {
  // A breadth-first propagation, originating from the selected cell.
  // Two-pass: from center to edge and from edge back to center.
  const state = store.getState()
  const memory = state.timeline.memory
  const select = state.timeline.select

  if (select === null || select.channel < 0 || select.frame < 0) {
    // No selection, no prediction.
    return
  }

  // Find the array of neighboring cells that will be included
  // to the prediction.
  const allCells = way.toArray(memory) // OPTIMIZE
  const cellsToPredict = allCells.filter(cell => {
    // Include only cells in neighborhood
    const timeDist = Math.abs(cell.time - select.frame)
    if (timeDist <= MAX_TIME_DISTANCE) {
      // Include only unknown cells
      if (cell.value === 0) {
        return true
      }
    }
    return false
  })

  // Order the cells by euclidean l2 distance to the selected cell.
  cellsToPredict.forEach(cell => {
    const dt = cell.time - select.frame
    const dw = cell.channel - select.channel
    const d = Math.sqrt(dt * dt + dw * dw)
    cell.dist = d
  })
  cellsToPredict.sort((a, b) => {
    return a.dist - b.dist
  })

  // Predict one by one
  runner.start(cellsToPredict, dispatch)
}
