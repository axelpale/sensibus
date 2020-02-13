module.exports = (state, dispatch, time) => {
  const timeline = state.timeline

  const root = document.createElement('div')
  root.classList.add('frame-title')
  root.classList.add('timeline-row-title')

  if (timeline.select && timeline.select.frame === time) {
    root.classList.add('frame-title-selected')
  }

  if (timeline.select && timeline.select.channel === -1) {
    root.classList.add('title-channel-selected')
  }

  const label = document.createElement('div')
  label.classList.add('frame-label')
  label.innerHTML = timeline.frames[time].title
  root.appendChild(label)

  root.addEventListener('click', () => {
    dispatch({
      type: 'SELECT_FRAME_TITLE',
      frame: time
    })
  })

  return root
}
