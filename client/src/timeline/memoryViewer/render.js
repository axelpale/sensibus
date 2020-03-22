const way = require('senseway')
const frameTitle = require('../frameTitles/frameTitle')
const frameEditor = require('../frameTitles/frameEditorRow')
const renderCell = require('./cell')

exports.create = (state, dispatch) => {
  const timeline = state.timeline
  const root = document.createElement('div')

  const W = way.width(timeline.memory)
  const LEN = way.len(timeline.memory)

  const select = timeline.select

  // Timeline events
  for (let t = LEN - 1; t >= 0; t -= 1) {
    // Frame editor
    if (select && t === select.frame) {
      root.appendChild(frameEditor(state, dispatch, t))
    }

    // Cells
    const row = document.createElement('div')
    row.classList.add('timeline-row')
    root.appendChild(row)

    row.appendChild(frameTitle(state, dispatch, t))

    const cells = document.createElement('div')
    cells.classList.add('cells')
    row.appendChild(cells) // TODO move under cell creation

    for (let c = 0; c < W; c += 1) {
      const cellEl = renderCell(state, dispatch, c, t)
      cells.appendChild(cellEl)
    }
  }

  return root
}

exports.updateFrameTitles = (state, dispatch) => {
  const labels = document.getElementsByClassName('frame-label')
  const titles = state.timeline.frames.map(frame => frame.title)

  // NOTE labels is not Array but array-like.
  for (let i = 0; i < labels.length; i += 1) {
    const frame = parseInt(labels[i].dataset.frame)
    labels[i].innerHTML = titles[frame]
  }
}
