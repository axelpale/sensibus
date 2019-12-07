const frameTitleEditor = require('./frameTitleEditor')

module.exports = (state, dispatch, time) => {
  const timeline = state.timeline

  const root = document.createElement('div')
  root.classList.add('row-title')

  if (timeline.frameOnEdit !== time) {
    root.innerHTML = timeline.frames[time].title

    root.addEventListener('click', ev => {
      dispatch({
        type: 'OPEN_FRAME_TITLE_EDITOR',
        frame: time
      })
    })
  } else {
    // Frame title editor
    root.appendChild(frameTitleEditor(state, dispatch))
  }

  return root
}
