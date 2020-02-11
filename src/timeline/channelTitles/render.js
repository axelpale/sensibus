const titleRow = require('./titleRow')
const editorRow = require('./editorRow')
require('./style.css')

module.exports = (state, dispatch) => {
  const root = titleRow(state, dispatch)

  const select = state.timeline.select
  if (select && select.frame === -1) {
    root.classList.add('channel-editor-container')
    root.appendChild(editorRow(state, dispatch))

    root.addEventListener('click', ev => {
      if (ev.target === root) {
        dispatch({
          type: 'SELECT_NONE'
        })
      }
    })
  }

  return root
}
