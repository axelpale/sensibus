const way = require('senseway')
const frameTitle = require('./frameTitle')
const renderCell = require('./cell')

module.exports = (state, dispatch) => {
  const timeline = state.timeline
  const root = document.createElement('div')

  const W = way.width(timeline.memory)
  const LEN = way.len(timeline.memory)

  // Timeline events
  for (let t = LEN - 1; t >= 0; t -= 1) {
    const row = document.createElement('div')
    row.classList.add('timeline-row')

    if (timeline.breaks.indexOf(t) >= 0) {
      row.classList.add('timeline-break')
    }

    root.appendChild(row)

    row.appendChild(frameTitle(state, dispatch, t))

    const cells = document.createElement('div')
    cells.classList.add('cells')
    row.appendChild(cells) // TODO move under cell creation

    for (let c = 0; c < W; c += 1) {
      const cell = renderCell(state, dispatch, c, t)
      cells.appendChild(cell)
    }
  }

  return root
}
