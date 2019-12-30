const predictors = require('./predictors/hydrate')
const timeline = require('./timeline/hydrate')

// TODO rename hydrate to hibernate

module.exports = (state) => {
  return {
    sidebar: state.sidebar,
    timeline: timeline(state.timeline),
    predictors: predictors(state.predictors)
  }
}
