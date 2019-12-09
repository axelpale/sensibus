const predictorRenderers = {
  ratePredictor: require('./ratePredictor/render')
}

module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  const heading = document.createElement('h2')
  heading.innerHTML = 'Prediction'
  root.appendChild(heading)

  const predictorRenderer = predictorRenderers[state.predictors.selection]
  root.appendChild(predictorRenderer(state, dispatch))

  return root
}
