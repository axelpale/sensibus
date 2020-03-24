const way = require('senseway')
const frameTitle = require('../frameTitles/frameTitle')
const frameEditor = require('../frameTitles/frameEditorRow')
const renderCell = require('./cell')

const getElsByClass = cl => Array.from(document.getElementsByClassName(cl))

exports.create = (store, dispatch) => {
  const timeline = store.getState().timeline
  const root = document.createElement('div')

  const W = way.width(timeline.memory)
  const LEN = way.len(timeline.memory)

  const select = timeline.select

  // Timeline events
  for (let t = LEN - 1; t >= 0; t -= 1) {
    // Frame editor
    if (select && t === select.frame) {
      root.appendChild(frameEditor(store, dispatch, t))
    }

    // Cells
    const row = document.createElement('div')
    row.classList.add('timeline-row')
    root.appendChild(row)

    row.appendChild(frameTitle(store, dispatch, t))

    const cells = document.createElement('div')
    cells.classList.add('cells')
    row.appendChild(cells) // TODO move under cell creation

    for (let c = 0; c < W; c += 1) {
      const cellEl = renderCell(store, dispatch, c, t)
      cells.appendChild(cellEl)
    }
  }

  return root
}

exports.updateFrameTitles = (store, dispatch) => {
  const state = store.getState()
  const labels = document.getElementsByClassName('frame-label')
  const titles = state.timeline.frames.map(frame => frame.title)

  // NOTE labels is not Array but array-like.
  for (let i = 0; i < labels.length; i += 1) {
    const frame = parseInt(labels[i].dataset.frame)
    labels[i].innerHTML = titles[frame]
  }
}

exports.updateSelect = (store, dispatch) => {
  // Unstyle the previous channel and frame
  const selectedEls = getElsByClass('cell-selected')
  selectedEls.forEach(el => el.classList.remove('cell-selected', 'cell-focus'))

  // Unstyle the previously selected frame titles
  const titleEls = getElsByClass('frame-title-selected')
  titleEls.forEach(el => el.classList.remove('frame-title-selected'))

  const select = store.getState().timeline.select
  if (select) {
    // Style the next channel and frame
    const c = select.channel
    const t = select.frame
    const channelClass = 'channel-' + c
    const frameClass = 'frame-' + t

    if (c !== null) {
      const els = getElsByClass(channelClass)
      els.forEach(el => el.classList.add('cell-selected'))
    }
    if (t !== null) {
      const els = getElsByClass(frameClass)
      els.forEach(el => el.classList.add('cell-selected'))
    }
    if (c !== null && t !== null) {
      const focusClass = channelClass + ' ' + frameClass
      const els = getElsByClass(focusClass)
      els.forEach(el => el.classList.add('cell-focus'))
    }

    // Style the next frame title
    if (t !== null) {
      const frameTitleClass = 'frame-title-' + t
      const els = getElsByClass(frameTitleClass)
      els.forEach(el => el.classList.add('frame-title-selected'))
    }
  }
}
