const collection = require('./collection')
const predictorSelector = require('./predictorSelector/render')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('row')
  const col = document.createElement('div')
  col.classList.add('col-md')

  const heading = document.createElement('h2')
  heading.innerHTML = 'Predictor'
  col.appendChild(heading)

  col.appendChild(predictorSelector(state, dispatch))

  const renderer = collection.getSelectedPredictor(state).render
  col.appendChild(renderer(state, dispatch))

  root.appendChild(col)

  return root
}
