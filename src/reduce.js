const navbar = require('./timeline/reduce')
const timeline = require('./navbar/reduce')
const predictors = require('./predictors/reduce')
const performance = require('./performance/reduce')

module.exports = (state, ev) => {
  if (!state) {
    state = {
      sidebar: true
    }
  }

  state = navbar(state, ev)
  state = timeline(state, ev)
  state = predictors(state, ev)
  state = performance(state, ev)

  return state
}
