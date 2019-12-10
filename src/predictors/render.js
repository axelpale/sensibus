const collection = require('./collection')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  const heading = document.createElement('h2')
  heading.innerHTML = 'Predictor'
  root.appendChild(heading)

  const renderer = collection.getSelectedPredictor(state).render
  root.appendChild(renderer(state, dispatch))

  return root
}
