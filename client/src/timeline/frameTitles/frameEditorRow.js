const template = require('./frameEditorRow.ejs')
const listen = require('uilib').listen

module.exports = (state, dispatch, time) => {
  const row = document.createElement('div')
  row.classList.add('frame-editor-row')

  // Generate frame editor only when frame-title-channel (-1) is selected.
  const select = state.timeline.select
  if (!select || select.channel !== -1) {
    return row
  }

  row.innerHTML = template({
    frame: time,
    frameTitle: state.timeline.frames[time].title
  })

  // Bind events

  listen(row, '#frameForm', 'submit', ev => {
    ev.preventDefault()
    dispatch({
      type: 'EDIT_FRAME_TITLE',
      frame: time,
      title: row.querySelector('#frameTitle').value
    })
  })

  listen(row, '#frameRemove', 'click', ev => {
    dispatch({
      type: 'REMOVE_FRAME',
      frame: time
    })
  })

  listen(row, '#frameMoveUp', 'click', ev => {
    dispatch({
      type: 'MOVE_FRAME',
      frame: time,
      offset: 1
    })
  })

  listen(row, '#frameMoveDown', 'click', ev => {
    dispatch({
      type: 'MOVE_FRAME',
      frame: time,
      offset: -1
    })
  })

  listen(row, '#frameCreateUp', 'click', ev => {
    dispatch({
      type: 'CREATE_FRAME',
      frame: time + 1
    })
  })

  listen(row, '#frameCreateDown', 'click', ev => {
    dispatch({
      type: 'CREATE_FRAME',
      frame: time
    })
  })

  return row
}
