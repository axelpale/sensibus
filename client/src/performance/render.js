const template = require('./template.ejs')
const tableTemplate = require('./table.ejs')
const progressTemplate = require('./progress.ejs')
const actions = require('./actions')
const problib = require('problib')
const createObserver = require('uilib').createObserver

const isRunningChanged = createObserver([
  state => state.performance.isRunning
])

// Root element
let root = null

module.exports = (state, dispatch) => {
  const local = state.performance

  // NOTE the order. Short-circuit OR can block isRunningChanged.
  if (isRunningChanged(state) || !local.isRunning) {
    // Render all
    if (root === null) {
      root = document.createElement('div')
    }
    root.innerHTML = template({
      isRunning: local.isRunning
    })

    if (local.isRunning) {
      root.querySelector('#perfStopBtn').addEventListener('click', ev => {
        actions.stop(state, dispatch)
      })
    } else {
      root.querySelector('#perfRunBtn').addEventListener('click', ev => {
        actions.run(state, dispatch)
      })
    }
  }

  const progress = progressTemplate({
    isRunning: local.isRunning,
    progress: local.progress,
    progressMax: local.progressMax
  })
  root.querySelector('#perfProgressContainer').innerHTML = progress

  const table = tableTemplate({
    predictorId: state.predictors.selection,
    elapsedSeconds: local.elapsedSeconds,
    progress: local.progress,
    progressMax: local.progressMax,
    confusion: local.confusion,
    precision: problib.precision(local.confusion),
    recall: problib.recall(local.confusion),
    accuracy: problib.accuracy(local.confusion),
    f1score: problib.f1score(local.confusion),
    mcc: problib.mcc(local.confusion)
  })
  root.querySelector('#perfTableContainer').innerHTML = table

  return root
}
