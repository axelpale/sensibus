const renderWay = require('../../../lib/renderWay')

module.exports = (state, model, dispatch) => {
  const root = document.createElement('div')

  const meansWay = model.channelMeans.map(m => [m])

  root.appendChild(renderWay(meansWay, {
    reversed: true,
    heading: 'Channel Means',
    caption: '',
    normalize: true
  }))

  return root
}
