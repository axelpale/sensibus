const collection = require('./collection')
const predictorSelector = require('./predictorSelector/render')
const createObserver = require('uilib').createObserver

const Trainer = require('./trainer.worker.js')
const trainer = new Trainer()

const modelWillChange = createObserver([
  state => state.timeline.memory,
  state => state.predictors.selection
  // TODO detect model parameter change. Must group models in state to detect.
])

const createTrainerMessageHandler = (dispatch) => {
  return (ev) => {
    if (ev.data.type === 'progress') {
      dispatch({
        type: 'TRAIN_PROGRESS',
        progress: ev.data.progress
      })
    } else if (ev.data.type === 'finish') {
      dispatch({
        type: 'TRAIN_FINISH',
        predictorId: ev.data.predictorId,
        model: ev.data.trainedModel
      })
    } else {
      throw new Error('Unknown event type from trainer: ' + ev.data.type)
    }
  }
}

exports.create = (store, dispatch) => {
  // Predictors' subscriber.
  const state = store.getState()

  if (modelWillChange(state)) {
    // Something about model should change, thus begin training.
    // First, define what happens when training finishes.
    trainer.onmessage = createTrainerMessageHandler(dispatch)
    // Then, begin training.
    trainer.postMessage({
      memory: state.timeline.memory,
      predictorId: collection.getPredictorId(state),
      predictorConfig: collection.getSelectedModel(state)
    })
  }

  const root = document.createElement('div')
  root.classList.add('row')
  const col = document.createElement('div')
  col.classList.add('col-md')

  const heading = document.createElement('h2')
  heading.innerHTML = 'Predict'
  col.appendChild(heading)

  col.appendChild(predictorSelector.create(store, dispatch))

  const renderer = collection.getSelectedPredictor(state).render
  const local = collection.getSelectedModel(state)
  col.appendChild(renderer(state, local, dispatch))

  root.appendChild(col)

  return root
}
