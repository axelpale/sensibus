exports.create = (state, dispatch) => {
  const row = document.createElement('div')

  row.classList.add('timeline-row')
  row.classList.add('channel-title-row')

  const rowTitle = document.createElement('div')
  rowTitle.classList.add('timeline-row-title')
  row.appendChild(rowTitle)

  const cells = document.createElement('div')
  cells.classList.add('cells')

  state.timeline.memory.forEach((ch, c) => {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.classList.add('channel-title')

    const select = state.timeline.select
    if (select && select.channel === c) {
      cell.classList.add('channel-selected')
    }
    if (select && select.frame === -1) {
      cell.classList.add('channel-title-frame-selected')
    }

    const val = state.timeline.channels[c].title
    cell.innerHTML = '<div class="cell-spine"></div>' +
      '<div class="cell-text">' + val + '</div>'

    cell.addEventListener('click', () => {
      dispatch({
        type: 'SELECT_CHANNEL_TITLE',
        channel: c
      })
    })

    cells.appendChild(cell)
  })

  row.appendChild(cells)

  return row
}
