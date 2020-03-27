/* eslint-env worker */
const trains = require('./collection/trains')

// Keep track of how many training procedures are running.
// TODO cancel running training process immediately.
let queue = 0

onmessage = (ev) => {
  // Begin a training procedure.
  // Cancel previous, possibly still running training.

  queue += 1

  const memory = ev.data.memory
  const predictorId = ev.data.predictorId
  const config = ev.data.predictorConfig
  const train = trains[predictorId]

  train(config, memory, (err, trainedModel) => {
    if (err) {
      return console.error(err)
    }

    queue -= 1
    if (queue === 0) {
      // Emit the the model trained on the latest memory.
      // There is little need to emit models that are about to change soon.
      postMessage({
        predictorId: predictorId,
        trainedModel: trainedModel
      })
    }
  })
}
