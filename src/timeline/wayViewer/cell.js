const lib = require('./lib')
const color = lib.color
const probToCircleRadius = lib.probToCircleRadius

module.exports = (state, dispatch, c, t) => {
  const timeline = state.timeline
  const sel = timeline.select

  const cell = document.createElement('div')
  cell.classList.add('cell')
  cell.classList.add('cell-event')

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

  const q = timeline.way[c][t]

  // Design rules:
  // - given or predicted probability -> radius
  // - unknown or known -> opacity

  let prob
  if (q === 0) {
    cell.classList.add('cell-unknown')
    prob = (state.predictors.prediction[c][t] + 1) / 2
    const probHtml = Math.floor(100 * prob)
    text.innerHTML = '' + probHtml
    icon.style.opacity = 0.5
  } else {
    cell.classList.add('cell-known')
    prob = q < 0 ? 0 : 1
  }
  icon.style.backgroundColor = color(state, c)
  icon.style.transform = 'scale(' + probToCircleRadius(prob) + ')'

  cell.addEventListener('click', ev => {
    dispatch({
      type: 'EDIT_CELL',
      channel: c,
      frame: t
    })
  })

  return cell
}
