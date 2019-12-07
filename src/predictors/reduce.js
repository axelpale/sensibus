const way = require('senseway')

module.exports = (state, ev) => {
  // Default
  if (!state.predictors) {
    state = Object.assign({}, state, {
      predictors: {
        prediction: way.fill(state.timeline.way, 0)
      }
    })
  }

  switch (ev.type) {
    case 'EDIT_CELL': {
      return Object.assign({}, state, {
        predictors: Object.assign({}, state.predictors, {
          prediction: way.fill(state.timeline.way, 0)
        })
      })
    }

    default: {
      return state
    }
  }
}
