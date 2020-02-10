const titleRow = require('./titleRow')
const editorRow = require('./editorRow')
require('./style.css')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')
  root.appendChild(titleRow(state, dispatch))

  const select = state.timeline.select
  if (select && select.frame === -1) {
    root.appendChild(editorRow(state, dispatch))
  }

  return root
}
