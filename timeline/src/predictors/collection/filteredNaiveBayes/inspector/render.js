const inferring = require('./inferring/render')
const training = require('./training/render')

module.exports = (state, model, dispatch) => {
  const root = document.createElement('div')

  root.appendChild(training(state, model, dispatch))
  root.appendChild(inferring(state, model, dispatch))

  return root
}
