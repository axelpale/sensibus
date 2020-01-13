const collection = require('./collection')
const predictorSelector = require('./predictorSelector/render')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('row')
  const col = document.createElement('div')
  col.classList.add('col-md')

  const heading = document.createElement('h2')
  heading.innerHTML = 'Predict'
  col.appendChild(heading)

  col.appendChild(predictorSelector(state, dispatch))

  const renderer = collection.getSelectedPredictor(state).render
  const local = collection.getSelectedModel(state)
  col.appendChild(renderer(state, local, dispatch))

  root.appendChild(col)

  return root
}
