const template = require('./template.ejs')

module.exports = (store, dispatch) => {
  const state = store.getState()
  const root = document.createElement('div')
  const select = state.timeline.select

  // Cell editor is only for cell selections
  if (select === null || select.channel < 0 || select.frame < 0) {
    root.innerHTML = 'Select a cell to view details.'
    return root
  }

  const c = select.channel
  const t = select.frame
  const channelTitle = state.timeline.channels[c].title
  const frameTitle = state.timeline.frames[t].title

  const givenValue = state.timeline.memory[c][t]
  const predictedValue = state.predictors.prediction[c][t].toFixed(2)

  root.innerHTML = template({
    channelTitle: channelTitle,
    frameTitle: frameTitle,
    c: c,
    t: t,
    givenValue: givenValue,
    predictedValue: predictedValue
  })

  root.querySelector('#edit-selectnone').addEventListener('click', ev => {
    dispatch({
      type: 'SELECT_NONE'
    })
  })

  return root.firstChild
}
