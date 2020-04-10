require('./style.css')
const titleRow = require('./titleRow')
const editorRow = require('./editorRow')
const createObserver = require('uilib').createObserver

const selectChanged = createObserver([
  state => state.timeline.select
])

let root
let titleRowEl
let editorRowEl

exports.create = (state, dispatch) => {
  root = document.createElement('div')
  root.classList.add('channel-titles')

  titleRowEl = titleRow.create(state, dispatch)
  root.appendChild(titleRowEl)

  editorRowEl = editorRow.create(state, dispatch)
  root.appendChild(editorRowEl)

  root.addEventListener('click', ev => {
    if (ev.target === root) {
      dispatch({
        type: 'SELECT_NONE'
      })
    }
  })

  return root
}

exports.update = (state, dispatch) => {
  const newTitleRowEl = titleRow.create(state, dispatch)
  root.replaceChild(newTitleRowEl, titleRowEl)
  titleRowEl = newTitleRowEl

  if (selectChanged(state)) {
    const select = state.timeline.select
    if (select && select.frame === -1) {
      root.classList.add('channel-editor-container')
    } else {
      root.classList.remove('channel-editor-container')
    }

    const newEditorRowEl = editorRow.create(state, dispatch)
    root.replaceChild(newEditorRowEl, editorRowEl)
    editorRowEl = newEditorRowEl
  }
}
