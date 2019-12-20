const frameTitleEditor = require('./frameTitleEditor')

module.exports = (state, dispatch, time) => {
  const timeline = state.timeline

  const root = document.createElement('div')
  root.classList.add('frame-title')
  root.classList.add('timeline-row-title')

  if (timeline.select.frame === time) {
    root.classList.add('frame-title-selected')
  }

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
