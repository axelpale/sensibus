const storage = require('./storage/reduce')
const sidebar = require('./timeline/reduce')
const timeline = require('./sidebar/reduce')
const predictors = require('./predictors/reduce')
const performance = require('./performance/reduce')

module.exports = (state, ev) => {
  if (!state) {
    state = {
      sidebar: false,
      sidebarPage: 'storage'
    }
  }

  // Root reducer debug tools:
  // console.log(state, ev)

  state = storage(state, ev)
  state = sidebar(state, ev)
  state = timeline(state, ev)
  state = predictors(state, ev)
  state = performance(state, ev)

  switch (ev.type) {
    default: {
      return state
    }
  }
}
