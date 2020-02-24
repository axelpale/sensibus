/* eslint-env worker */
const way = require('senseway')
const infers = require('../predictors/collection/infers')
const trains = require('../predictors/collection/trains')

onmessage = (ev) => {
  // Begin a cross validation performance test.

  const mem = ev.data.memory
  const predictorId = ev.data.predictorId
  const infer = infers[predictorId]
  const train = trains[predictorId]
  const config = ev.data.predictorConfig

  const trainingSets = way.toArray(mem).filter(elem => {
    return elem.value !== 0
  }).map(knownElem => {
    return {
      target: knownElem,
      memory: way.set(mem, knownElem.channel, knownElem.time, 0)
    }
  })

  const beginTime = Date.now()
  let confusion = {
    n: 0,
    truePos: 0,
    trueNeg: 0,
    falsePos: 0,
    falseNeg: 0
  }

  trainingSets.forEach(trainSet => {
    // Make cell unknown to prevent predictor just using it to get max score.
    const hiddenTarget = Object.assign({}, trainSet.target, { value: 0 })
    const model = train(config, trainSet.memory)
    const results = infer(model, hiddenTarget, trainSet.memory)

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

    // Update and replace
    confusion = {
      n: confusion.n + 1,
      truePos: confusion.truePos + predicted * actual,
      trueNeg: confusion.trueNeg + (1 - predicted) * (1 - actual),
      falsePos: confusion.falsePos + predicted * (1 - actual),
      falseNeg: confusion.falseNeg + (1 - predicted) * actual
    }

    const currentTime = Date.now()

    // Emit the updated confusion matrix
    postMessage({
      progress: confusion.n,
      progressMax: trainingSets.length,
      confusion: confusion,
      elapsedSeconds: Math.floor((currentTime - beginTime) / 1000)
    })
  })

  // Performance test end
}
