const template = require('./template.ejs')
const run = require('./run')
const problib = require('problib')

module.exports = (state, dispatch) => {
  const local = state.performance
  const root = document.createElement('div')
  root.innerHTML = template({
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
    root.querySelector('button').addEventListener('click', ev => {
      run(state, dispatch)
    })
  }

  return root.firstChild
}
