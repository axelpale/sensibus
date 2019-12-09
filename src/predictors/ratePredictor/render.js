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
  const local = state.predictors.ratePredictor
  const root = document.createElement('div')

  const supEl = document.createElement('div')
  local.supports.forEach((sup, c) => {
    const t = Math.floor(way.len(sup) / 2)
    const selected = way.set(way.fill(sup, 0), c, t, 1)

    supEl.appendChild(renderWay(sup, {
      reversed: true,
      heading: 'Support by ' + channelTitle(state, c),
      caption: '',
      normalize: true,
      selected: selected
    }))
  })
  root.appendChild(supEl)

  const varEl = document.createElement('div')
  local.variances.forEach((sup, c) => {
    varEl.appendChild(renderWay(sup, {
      reversed: true,
      heading: 'Variance for ' + channelTitle(state, c),
      caption: '',
      normalize: true
    }))
  })
  root.appendChild(varEl)

  const devEl = document.createElement('div')
  local.deviationFields.forEach((dev, c) => {
    devEl.appendChild(renderWay(dev, {
      reversed: true,
      heading: 'Deviation for ' + channelTitle(state, c),
      caption: '',
      normalize: true
    }))
  })
  root.appendChild(devEl)

  return root
}
