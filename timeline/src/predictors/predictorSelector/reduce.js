module.exports = (state, ev) => {
  switch (ev.type) {
    case 'SELECT_PREDICTOR': {
      return Object.assign({}, state, {
        predictors: Object.assign({}, state.predictors, {
          currentId: ev.key
        })
      })
    }

    default:
      return state
  }
}
