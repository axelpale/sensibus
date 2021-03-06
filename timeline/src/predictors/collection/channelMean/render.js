const renderWay = require('../../../lib/renderWay')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  root.innerHTML = '<h3>How it works</h3>' +
    '<p>This predictor computes the average for each channel. ' +
    'Then it guesses each unknown point to have that average value. ' +
    'It does not pay attention to possible connections between points.</p>'

  const s = state.predictors
  if (s.trained && s.trainedPredictor === 'channelMean') {
    const meansWay = s.trainedModel.channelMeans.map(m => [m])
    root.appendChild(renderWay(meansWay, {
      reversed: true,
      heading: 'Channel Means',
      caption: '',
      normalize: true
    }))
  }

  return root
}
