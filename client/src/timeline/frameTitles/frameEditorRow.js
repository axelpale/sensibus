require('./style.css')
const template = require('./frameEditorRow.ejs')
const listen = require('uilib').listen

module.exports = (state, dispatch, frame) => {
  const row = document.createElement('div')
  row.classList.add('frame-editor-row')

  // Generate frame editor only when frame-title-channel (-1) is selected.
  const select = state.timeline.select
  if (!select || select.channel !== -1) {
    return row
  }

  row.innerHTML = template({
    frame: frame,
    frameTitle: state.timeline.frames[frame].title
  })

  // Bind events

  listen(row, '#frameForm', 'submit', ev => {
    // Not sure if this is needed... but to be safe.
    ev.preventDefault()
  })

  listen(row, '#frameTitleInput', 'input', ev => {
    dispatch({
      type: 'EDIT_FRAME_TITLE',
      frame: frame,
      title: row.querySelector('#frameTitleInput').value
    })
  })

  listen(row, '#frameRemove', 'click', ev => {
    dispatch({
      type: 'REMOVE_FRAME',
      frame: frame
    })
  })

  listen(row, '#frameMoveUp', 'click', ev => {
    dispatch({
      type: 'MOVE_FRAME',
      frame: frame,
      offset: 1
    })
  })

  listen(row, '#frameMoveDown', 'click', ev => {
    dispatch({
      type: 'MOVE_FRAME',
      frame: frame,
      offset: -1
    })
  })

  listen(row, '#frameCreateUp', 'click', ev => {
    dispatch({
      type: 'CREATE_FRAME',
      frame: frame + 1
    })
  })

  listen(row, '#frameCreateDown', 'click', ev => {
    dispatch({
      type: 'CREATE_FRAME',
      frame: frame
    })
  })

  listen(row, '#frameFormClose', 'click', ev => {
    dispatch({
      type: 'SELECT_NONE'
    })
  })

  return row
}
