const predictors = require('./predictors/hibernate')
const timeline = require('./timeline/hibernate')

module.exports = (state) => {
  return {
    sidebar: state.sidebar,
    timeline: timeline(state.timeline),
    predictors: predictors(state.predictors)
  }
}
