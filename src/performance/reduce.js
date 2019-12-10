const way = require('senseway')
const predictorCollection = require('../predictors/collection')

module.exports = (state, ev) => {
  // Leave-one-out method:
  // For each known value
  //   clone the memory but set the known value to 0
  //   make prediction
  //   compare prediction to the known value
  //     know  1, pred  1 => point  1
  //     know  1, pred -1 => point -1
  //     know -1, pred  1 => point -1
  //     know -1, pred -1 => point  1
  //     know  1, pred  0 => point  0
  //     know -1, pred  0 => point  0
  //
  const mem = state.timeline.way
  const predictor = predictorCollection.getSelectedPredictor(state)

  const testSets = way.toArray(mem).filter(elem => {
    return elem.value !== 0
  }).map(knownElem => {
    return {
      target: knownElem,
      memory: way.set(mem, knownElem.channel, knownElem.time, 0)
    }
  })

  const scoreSum = testSets.reduce((acc, testSet) => {
    const results = predictor.predict(testSet.memory)
    const c = testSet.target.channel
    const t = testSet.target.time
    return acc + results.prediction[c][t] * testSet.target.value
  }, 0)

  return Object.assign({}, state, {
    performance: {
      score: scoreSum
    }
  })
}
