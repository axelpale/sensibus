const way = require('senseway')
const pat = require('sensepat')
const wayElem = require('../../lib/wayElem')
const predict = require('../../lib/predict')

module.exports = (model, dispatch) => {
  const root = document.createElement('div')

  const c = model.select.channel
  const t = model.select.time
  const pred = predict(model, c, t)
  const predWay = way.set(model.timeline, c, t, pred.prob)

  root.appendChild(wayElem(pred.context.value, {
    reversed: true,
    heading: 'Pred Context Value',
    caption: ''
  }))

  root.appendChild(wayElem(pred.context.mass, {
    reversed: true,
    heading: 'Pred Context Mass',
    caption: ''
  }))

  root.appendChild(wayElem(pred.contextPrior.value, {
    reversed: true,
    heading: 'Pred Context Prior Value',
    caption: ''
  }))

  root.appendChild(wayElem(pred.contextPrior.mass, {
    reversed: true,
    heading: 'Pred Context Prior Mass',
    caption: ''
  }))

  root.appendChild(wayElem(pred.zeroMean.value, {
    reversed: true,
    heading: 'Pred 0 Mean Value',
    caption: ''
  }))
  root.appendChild(wayElem(pred.zeroMean.mass, {
    reversed: true,
    heading: 'Pred 0 Mean Mass',
    caption: ''
  }))

  root.appendChild(wayElem(pred.oneMean.value, {
    reversed: true,
    heading: 'Pred 1 Mean Value',
    caption: ''
  }))
  root.appendChild(wayElem(pred.oneMean.mass, {
    reversed: true,
    heading: 'Pred 1 Mean Mass',
    caption: ''
  }))

  root.appendChild(wayElem(pred.zeroGain.value, {
    reversed: true,
    heading: 'Pred 0 Gain Value',
    caption: ''
  }))
  root.appendChild(wayElem(pred.zeroGain.mass, {
    reversed: true,
    heading: 'Pred 0 Gain Mass',
    caption: ''
  }))

  root.appendChild(wayElem(pred.oneGain.value, {
    reversed: true,
    heading: 'Pred 1 Gain Value',
    caption: ''
  }))
  root.appendChild(wayElem(pred.oneGain.mass, {
    reversed: true,
    heading: 'Pred 1 Gain Mass',
    caption: ''
  }))

  root.appendChild(wayElem(pred.zeroField, {
    reversed: true,
    heading: 'Pred 0 Field',
    caption: ''
  }))

  root.appendChild(wayElem(pred.oneField, {
    reversed: true,
    heading: 'Pred 1 Field',
    caption: ''
  }))

  // Single-cell prediction viewer & cell selector
  const waySelected = (() => {
    const c = model.select.channel
    const t = model.select.time
    return way.set(way.fill(model.timeline, 0), c, t, 1)
  })()
  const predElem = wayElem(predWay, {
    reversed: true,
    heading: 'Prediction',
    selected: waySelected,
    caption: 'Context mean shows the probability of cell being 1 given '
      + 'the selected event becoming 1. With Bayes\' rule we compute '
      + 'the probability of the selected event given the context.'
  })
  predElem.addEventListener('click', (ev) => {
    const c = parseInt(ev.target.dataset.channel)
    const t = parseInt(ev.target.dataset.time)

    // NaN in case where non-cell was clicked
    if (isNaN(c) || isNaN(t)) {
      return
    }

    dispatch({
      type: 'HOW_EDIT_SELECTED',
      channel: c,
      time: t
    })
  })
  root.appendChild(predElem)

  return root
}
