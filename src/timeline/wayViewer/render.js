const way = require('senseway')
const frameTitle = require('./frameTitle')
const predict = require('../../lib/predict')

const color = (state, channel) => {
  const c = channel
  const N = state.timeline.channels.length
  const hue = '' + (360 * (1 - c / N))
  const sat = '100'
  const lig = '40'
  const hsl = 'hsl(' + hue + ',' + sat + '%,' + lig + '%)'
  return hsl
}

const probToCircleRadius = (prob) => {
  // Return 0..1 as the radius of a unit circle.
  //
  // Area of an unit circle.
  // unitArea = PI * r1 * r1 = PI * 1 * 1 = PI
  // probArea = prob * PI
  //
  // probArea = PI * r * r
  // => r = sqrt(probArea / PI)
  // => r = sqrt(prob * PI / PI)
  // => r = sqrt(prob)

  return Math.sqrt(prob)
}

module.exports = (state, dispatch) => {
  const timeline = state.timeline
  const root = document.createElement('div')

  const W = way.width(timeline.way)
  const LEN = way.len(timeline.way)

  // Timeline events
  for (let t = LEN - 1; t >= 0; t -= 1) {
    const row = document.createElement('div')
    row.classList.add('row')
    root.appendChild(row)

    row.appendChild(frameTitle(state, dispatch, t))

    const cells = document.createElement('div')
    cells.classList.add('cells')
    row.appendChild(cells)

    for (let c = 0; c < W; c += 1) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.classList.add('cell-event')

      if (timeline.select.channel === c && timeline.select.frame === t) {
        cell.classList.add('cell-selected')
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

      const val = timeline.way[c][t]

      if (val === 0) {
        cell.classList.add('cell-unknown')
        const pred = predict(state, c, t)
        if (pred.prob < 0.5) {
          cell.classList.add('cell-improbable')
        } else {
          cell.classList.add('cell-probable')
        }
        text.innerHTML = '<span>' + Math.floor(100 * pred.prob) + '%</span>'
        icon.style.backgroundColor = color(state, c)
        const scale = probToCircleRadius(pred.prob)
        icon.style.transform = 'scale(' + scale + ')'
      } else {
        cell.classList.add('cell-known')
        icon.style.backgroundColor = color(state, c)
        const scale = probToCircleRadius(val)
        icon.style.transform = 'scale(' + scale + ')'
      }

      cell.addEventListener('click', ev => {
        dispatch({
          type: 'EDIT_CELL',
          channel: c,
          frame: t
        })
      })

      cells.appendChild(cell)
    }
  }

  return root
}
