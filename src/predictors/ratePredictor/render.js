const renderWay = require('../../lib/renderWay')

module.exports = (state, dispatch) => {
  const local = state.predictors.ratePredictor
  const root = document.createElement('div')

  root.appendChild(renderWay(local.means, {
    reversed: true,
    heading: 'Mean rate',
    caption: '',
    normalize: true
  }))

  return root
}
