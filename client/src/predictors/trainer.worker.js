/* eslint-env worker */
const trains = require('./collection/trains')

const noop = () => {}
let cancelOngoing = noop

onmessage = (ev) => {
  // Begin a training procedure.
  // Cancel previous, possibly still running training.
  // There is little need to emit models that are about to change soon.

  cancelOngoing()

  const memory = ev.data.memory
  const predictorId = ev.data.predictorId
  const config = ev.data.predictorConfig
  const train = trains[predictorId]

  const onProgress = (progressObj) => {
    postMessage({
      type: 'progress',
      predictorId: predictorId,
      progress: progressObj.progress
    })
  }

  const onFinish = (err, trainedModel) => {
    if (err) {
      return console.error(err)
    }

    // Ensure that calling cancel after finish does not do harm.
    cancelOngoing = noop

    // Emit the the model trained on the given memory.
    postMessage({
      predictorId: predictorId,
      trainedModel: trainedModel
    })
  }

  cancelOngoing = train(config, memory, onProgress, onFinish)
}
