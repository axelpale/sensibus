const predictors = require('./predictors/migrate')
const timeline = require('./timeline/migrate')

module.exports = (state) => {
  return {
    sidebar: typeof state.sidebar === 'undefined' ? true : state.sidebar,
    sidebarPage: state.sidebarPage ? state.sidebarPage : 'storage',
    timeline: timeline(state.timeline),
    predictors: predictors(state.predictors)
  }
}
