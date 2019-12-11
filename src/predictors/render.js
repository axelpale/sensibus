const collection = require('./collection')
const predictorSelector = require('./predictorSelector/render')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  const heading = document.createElement('h2')
  heading.innerHTML = 'Predictor'
  root.appendChild(heading)

  root.appendChild(predictorSelector(state, dispatch))

  const renderer = collection.getSelectedPredictor(state).render
  root.appendChild(renderer(state, dispatch))

  return root
}
