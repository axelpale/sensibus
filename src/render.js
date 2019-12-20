const navbar = require('./navbar/render')
const timeline = require('./timeline/render')
const predictors = require('./predictors/render')
const performance = require('./performance/render')

module.exports = (state, dispatch) => {
  navbar(state, dispatch)

  const root = document.createElement('div')
  root.appendChild(timeline(state, dispatch))
  root.appendChild(predictors(state, dispatch))
  root.appendChild(performance(state, dispatch))
  return root
}
