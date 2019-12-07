const way = require('senseway')

const renderWay = (wa, opts) => {
  const el = document.createElement('div')
  el.classList.add('way-container')
  el.innerHTML = way.html(wa, opts)
  return el
}

const channelTitle = (state, c) => {
  return state.timeline.channels[c].title
}

module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  const heading = document.createElement('h2')
  heading.innerHTML = 'Prediction'
  root.appendChild(heading)

  const supEl = document.createElement('div')
  state.predictors.supports.forEach((sup, c) => {
    const t = Math.floor(way.len(sup) / 2)
    const selected = way.set(way.fill(sup, 0), c, t, 1)

    supEl.appendChild(renderWay(sup, {
      reversed: true,
      heading: 'Support for ' + channelTitle(state, c),
      caption: '',
      normalize: true,
      selected: selected
    }))
  })
  root.appendChild(supEl)

  const varEl = document.createElement('div')
  state.predictors.variances.forEach((sup, c) => {
    varEl.appendChild(renderWay(sup, {
      reversed: true,
      heading: 'Variance for ' + channelTitle(state, c),
      caption: '',
      normalize: true
    }))
  })
  root.appendChild(varEl)

  return root
}
