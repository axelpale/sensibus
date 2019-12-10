const renderWay = require('../../lib/renderWay')

module.exports = (state, dispatch) => {
  const local = state.predictors.ratePredictor
  const root = document.createElement('div')

  root.appendChild(renderWay(local.probs, {
    reversed: true,
    heading: 'Proba&shy;bi&shy;lity',
    caption: '',
    normalize: true
  }))

  root.appendChild(renderWay(local.certs, {
    reversed: true,
    heading: 'Cer&shy;tain&shy;ty',
    caption: '',
    normalize: true
  }))

  return root
}
