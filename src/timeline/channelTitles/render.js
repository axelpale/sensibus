const titleRow = require('./titleRow')
const editorRow = require('./editorRow')
require('./style.css')

module.exports = (state, dispatch) => {
  const root = titleRow(state, dispatch)

  const select = state.timeline.select
  if (select && select.frame === -1) {
    root.classList.add('channel-editor-container')
    root.appendChild(editorRow(state, dispatch))
  }

  return root
}
