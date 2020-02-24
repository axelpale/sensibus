const template = require('./template.ejs')
const actions = require('./actions')
const problib = require('problib')

module.exports = (state, dispatch) => {
  const local = state.performance
  const root = document.createElement('div')
  root.innerHTML = template({
    predictorId: state.predictors.selection,
    elapsedSeconds: local.elapsedSeconds,
    isRunning: local.progress !== local.progressMax,
    progress: local.progress,
    progressMax: local.progressMax,
    confusion: local.confusion,
    precision: problib.precision(local.confusion),
    recall: problib.recall(local.confusion),
    accuracy: problib.accuracy(local.confusion),
    f1score: problib.f1score(local.confusion),
    mcc: problib.mcc(local.confusion)
  })

  if (local.progress === local.progressMax) {
    root.querySelector('#perfRunBtn').addEventListener('click', ev => {
      actions.run(state, dispatch)
    })
  } else {
    root.querySelector('#perfStopBtn').addEventListener('click', ev => {
      actions.stop(state, dispatch)
    })
  }

  return root.firstChild
}
