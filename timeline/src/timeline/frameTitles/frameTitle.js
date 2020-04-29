module.exports = (store, dispatch, frame) => {
  const timeline = store.getState().timeline

  const root = document.createElement('div')
  root.classList.add('frame-title')
  root.classList.add('timeline-row-title')
  root.classList.add('frame-title-' + frame)

  if (timeline.select && timeline.select.frame === frame) {
    root.classList.add('frame-title-selected')
  }

  if (timeline.select && timeline.select.channel === -1) {
    root.classList.add('title-channel-selected')
  }

  const label = document.createElement('div')
  label.classList.add('frame-label')
  label.innerHTML = timeline.frames[frame].title
  label.dataset.frame = '' + frame // for easy update
  root.appendChild(label)

  root.addEventListener('click', () => {
    dispatch({
      type: 'SELECT_FRAME_TITLE',
      frame: frame
    })
  })

  return root
}
