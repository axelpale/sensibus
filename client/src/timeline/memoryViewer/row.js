const way = require('senseway')
const frameTitle = require('../frameTitles/frameTitle')
const renderCell = require('./cell')

module.exports = (store, dispatch, t) => {
  const state = store.getState()
  const W = way.width(state.timeline.memory)

  // // Frame editor
  // if (select && t === select.frame) {
  //   root.appendChild(frameEditor(store, dispatch, t))
  // }

  // Cells
  const row = document.createElement('div')
  row.classList.add('timeline-row')
  row.classList.add('row-frame-' + t)

  // Frame title
  row.appendChild(frameTitle(store, dispatch, t))

  // Init cells container
  const cells = document.createElement('div')
  cells.classList.add('cells')
  row.appendChild(cells) // TODO move under cell creation

  // Create and append cells
  for (let c = 0; c < W; c += 1) {
    const cellEl = renderCell(store, dispatch, c, t)
    cells.appendChild(cellEl)
  }

  return row
}
