const way = require('senseway')

module.exports = (state, ev) => {
  // Default
  if (!state.predictors) {
    state = Object.assign({}, state, {
      predictors: {
        prediction: way.fill(state.timeline.way, 0),
        supports: []
      }
    })
  }

  // Compute prediction
  // TODO do not do at every event

  // For every channel c
  // Find every event e in c
  // Get hood of e
  // Sum to get the support field
  const w = state.timeline.way
  const ctxLen = 5
  const ctxWidth = way.width(w)

  const supports = w.map((ch, c) => {
    return ch.reduce((acc, q, t) => {
      if (q === 1) {
        const hood = way.sliceAround(w, ctxLen, t)
        return way.add(acc, hood)
      }
      return acc
    }, way.create(ctxWidth, ctxLen, 0))
  })

  // Standard deviation for each support
  const vars = supports.map(sup => {
    return way.variance(sup)
  })

  // Support deviation from local channel mean
  const devs = supports.map(sup => {
    const m = way.mean(sup)
    return way.map(sup, (q, c) => {
      return Math.abs(q - m[c])
    })
  })

  return Object.assign({}, state, {
    predictors: Object.assign({}, state.predictors, {
      prediction: way.fill(state.timeline.way, 0),
      supports: supports,
      variances: vars,
      deviationFields: devs
    })
  })
}
