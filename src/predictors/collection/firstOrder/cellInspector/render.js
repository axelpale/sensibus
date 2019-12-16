const template = require('./template.ejs')

module.exports = (state, local, dispatch) => {
  const root = document.createElement('div')

  root.innerHTML = template({
    c: state.timeline.select.channel,
    t: state.timeline.select.frame,
    memory: state.timeline.way,
    prediction: state.predictors.prediction
  })

  // root.querySelector('#field-length').addEventListener('change', (ev) => {
  //   dispatch({
  //     type: 'SELECT_FIELD_LENGTH',
  //     length: parseInt(ev.target.value)
  //   })
  // })

  return root
}
