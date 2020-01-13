const predictors = require('./predictors/migrate')
const timeline = require('./timeline/migrate')

module.exports = (state) => {
  return {
    sidebar: state.sidebar,
    timeline: timeline(state.timeline),
    predictors: predictors(state.predictors)
  }
}
