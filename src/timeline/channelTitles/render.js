module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  const row = document.createElement('div')
  row.classList.add('timeline-row')

  const rowTitle = document.createElement('div')
  rowTitle.classList.add('timeline-row-title')
  row.appendChild(rowTitle)

  const cells = document.createElement('div')
  cells.classList.add('cells')

  state.timeline.way.forEach((ch, c) => {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.classList.add('cell-title')
    const val = state.timeline.channels[c].title
    cell.innerHTML = '<div class="cell-text">' + val + '</div>'

    cell.addEventListener('click', ev => {
      dispatch({
        type: 'OPEN_CHANNEL_TITLE_EDITOR',
        channel: c
      })
    })

    cells.appendChild(cell)
  })

  row.appendChild(cells)
  root.appendChild(row)

  return root
}
