const lib = require('./lib')
// const prettyRatios = require('./prettyRatios')
const color = lib.colorSunset
const probToCircleRadius = lib.probToCircleRadius

module.exports = (store, dispatch, c, t) => {
  const state = store.getState()
  const timeline = state.timeline
  const sel = timeline.select

  const cell = document.createElement('div')
  cell.classList.add('cell')
  cell.classList.add('cell-event')
  cell.classList.add('channel-' + c)
  cell.classList.add('frame-' + t)

  if (sel && (sel.channel === c || sel.frame === t)) {
    cell.classList.add('cell-selected')
    if (sel.channel === c && sel.frame === t) {
      cell.classList.add('cell-focus')
    }
  }

  const spine = document.createElement('div')
  spine.classList.add('cell-spine')
  cell.appendChild(spine)

  const icon = document.createElement('div')
  icon.classList.add('cell-icon')
  cell.appendChild(icon)

  const text = document.createElement('div')
  text.classList.add('cell-text')
  cell.appendChild(text)

  const q = timeline.memory[c][t]

  // Design rules:
  // - given or predicted probability -> radius
  // - unknown or known -> opacity

  let prob
  if (q === 0) {
    cell.classList.add('cell-unknown')
    if (state.predictors.prediction) {
      prob = (state.predictors.prediction[c][t] + 1) / 2
    } else {
      prob = 0
    }
    // Percent-style numbers
    const probHtml = Math.floor(100 * prob)
    text.innerHTML = '' + probHtml + '<sub>%</sub>'
    // Alternatively:
    // Pretty ratios
    // text.innerHTML = '' + prettyRatios.ratio7(prob)
    icon.style.opacity = 0.5
  } else {
    cell.classList.add('cell-known')
    prob = q < 0 ? 0 : 1
  }
  icon.style.backgroundColor = color(state, c)
  icon.style.transform = 'scale(' + probToCircleRadius(prob) + ')'

  cell.addEventListener('click', ev => {
    const sel = store.getState().timeline.select
    if (sel && sel.channel === c && sel.frame === t) {
      // If the clicked cell is already focused.
      dispatch({
        type: 'EDIT_CELL',
        channel: c,
        frame: t
      })
    } else if (sel && (sel.channel === c || sel.frame === t)) {
      // If another cell in same channel or frame is clicked.
      dispatch({
        type: 'SELECT_CELL',
        channel: c,
        frame: t
      })
      dispatch({
        type: 'EDIT_CELL',
        channel: c,
        frame: t
      })
    } else if (sel && sel.channel > -1 && sel.frame > -1) {
      // If none of the above happens but a cell is clicked anyway.
      // Away from the cross.
      dispatch({
        type: 'SELECT_CELL',
        channel: c,
        frame: t
      })
      dispatch({
        type: 'EDIT_CELL',
        channel: c,
        frame: t
      })
      // dispatch({
      //   type: 'SELECT_NONE'
      // })
    } else {
      // If nothing has been selected, select and edit the cell.
      dispatch({
        type: 'SELECT_CELL',
        channel: c,
        frame: t
      })
      dispatch({
        type: 'EDIT_CELL',
        channel: c,
        frame: t
      })
    }
  })

  return cell
}
