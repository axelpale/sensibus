const way = require('senseway')
const predictorCollection = require('../predictors/collection')

module.exports = (state) => {
  // Leave-one-out cross-validation:
  // For each known value
  //   clone the memory but set the known value to 0
  //   make prediction
  //   compare prediction to the known value
  const mem = state.timeline.memory
  const predictor = predictorCollection.getSelectedPredictor(state)
  const config = predictorCollection.getSelectedModel(state)

  const trainingSets = way.toArray(mem).filter(elem => {
    return elem.value !== 0
  }).map(knownElem => {
    return {
      target: knownElem,
      memory: way.set(mem, knownElem.channel, knownElem.time, 0)
    }
  })

  const results = trainingSets.reduce((acc, trainSet) => {
    const model = predictor.train(config, trainSet.memory)
    const results = predictor.infer(model, trainSet.target, trainSet.memory)

    // Scoring Guidelines.
    // Initially we did the scoring with trits and multiplication:
    //     know  1, pred  1 => point  1
    //     know  1, pred -1 => point -1
    //     know -1, pred  1 => point -1
    //     know -1, pred -1 => point  1
    //     know  1, pred  0 => point  0
    //     know -1, pred  0 => point  0
    // However, it does not capture reality if known or predicted are not int.
    //
    // If correct value is 1 and prediction is 50/50, then the prediction
    // is correct 5 times in 10 and wrong also 5/10.
    // If correct value is -0.8 and prediction is -0.6, then there is
    // o value assigns 0.1 prob for +1 and 0.9 prob for -1
    // o prediction assigns 0.2 prob for +1 and 0.8 prob for -1
    // Therefore the confusion matrix:
    // o true positive with prob 0.1*0.2
    // o true negative with prob 0.9*0.8
    // o false positive with prob 0.9*0.2
    // o false negative with prob 0.1*0.8
    // The four always sum to 1.
    const predicted = (1 + results.prediction) / 2 // trit to prob for +1
    const actual = (1 + trainSet.target.value) / 2 // trit to prob for +1

    acc.truePos += predicted * actual
    acc.trueNeg += (1 - predicted) * (1 - actual)
    acc.falsePos += predicted * (1 - actual)
    acc.falseNeg += (1 - predicted) * actual // predict neg but actually pos

    return acc
  }, {
    numTrainingSets: trainingSets.length,
    truePos: 0,
    trueNeg: 0,
    falsePos: 0,
    falseNeg: 0
  })

  return results
}
