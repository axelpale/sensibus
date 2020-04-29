const predictors = require('./predictors/migrate')
const timeline = require('./timeline/migrate')

module.exports = (state) => {
  // Populate sidebar
  state = Object.assign({}, state, {
    sidebar: typeof state.sidebar === 'undefined' ? true : state.sidebar,
    sidebarPage: state.sidebarPage ? state.sidebarPage : 'storage'
  })

  state = timeline(state)
  state = predictors(state)

  return state
}
