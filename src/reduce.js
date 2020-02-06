const storage = require('./storage/reduce')
const navbar = require('./timeline/reduce')
const timeline = require('./navbar/reduce')
const predictors = require('./predictors/reduce')
const performance = require('./performance/reduce')

module.exports = (state, ev) => {
  if (!state) {
    state = {
      sidebar: true,
      sidebarPage: 'storage'
    }
  }

  // Root reducer debug tools:
  // console.log(state, ev)

  state = storage(state, ev)
  state = navbar(state, ev)
  state = timeline(state, ev)
  state = predictors(state, ev)
  state = performance(state, ev)

  switch (ev.type) {
    default: {
      return state
    }
  }
}
