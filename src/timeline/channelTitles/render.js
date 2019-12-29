module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  const row = document.createElement('div')
  row.classList.add('timeline-row')

  const rowTitle = document.createElement('div')
  rowTitle.classList.add('timeline-row-title')
  row.appendChild(rowTitle)

  const cells = document.createElement('div')
  cells.classList.add('cells')

  state.timeline.memory.forEach((ch, c) => {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.classList.add('cell-title')

    const select = state.timeline.select
    if (select && select.channel === c) {
      cell.classList.add('cell-title-selected')
    }

    const val = state.timeline.channels[c].title
    cell.innerHTML = '<div class="cell-text">' + val + '</div>'

    cells.appendChild(cell)
  })

  row.appendChild(cells)
  root.appendChild(row)

  return root
}
