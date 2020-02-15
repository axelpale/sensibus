const template = require('./frameEditorRow.ejs')

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

  return row
}
