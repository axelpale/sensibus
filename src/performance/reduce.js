const way = require('senseway')
const predictorCollection = require('../predictors/collection')

module.exports = (state, ev) => {
  // Leave-one-out cross-validation:
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

  const trainingSets = way.toArray(mem).filter(elem => {
    return elem.value !== 0
  }).map(knownElem => {
    return {
      target: knownElem,
      memory: way.set(mem, knownElem.channel, knownElem.time, 0)
    }
  })

  const results = trainingSets.reduce((acc, trainingSet) => {
    const results = predictor.predict(trainingSet.memory)
    const c = trainingSet.target.channel
    const t = trainingSet.target.time

    const pred = results.prediction[c][t]
    const corr = trainingSet.target.value
    const score = pred * corr

    acc.truePos += (pred > 0 && corr > 0) ? score : 0
    acc.trueNeg += (pred < 0 && corr < 0) ? score : 0
    acc.falsePos += (pred > 0 && corr < 0) ? -score : 0
    acc.falseNeg += (pred < 0 && corr > 0) ? -score : 0
    acc.score += score / trainingSets.length

    return acc
  }, {
    numTrainingSets: trainingSets.length,
    truePos: 0,
    trueNeg: 0,
    falsePos: 0,
    falseNeg: 0,
    score: 0
  })

  return Object.assign({}, state, {
    performance: results
  })
}
