const template = require('./template.ejs')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  // Cell editor is only for selections
  if (!state.timeline.select) {
    return root
  }

  const c = state.timeline.select.channel
  const t = state.timeline.select.frame
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
