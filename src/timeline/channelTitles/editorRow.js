const template = require('./editorRow.ejs')

module.exports = (state, dispatch) => {
  const editorRow = document.createElement('div')
  editorRow.classList.add('timeline-row')
  editorRow.classList.add('channel-editor-row')

  // Assert select not null
  const select = state.timeline.select

  editorRow.innerHTML = template({
    chan: select.channel
  })

  return editorRow
}
