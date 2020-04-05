const way = require('senseway')
const predictorSelector = require('./predictorSelector/reduce')
const collection = require('./collection')

const delegate = (state, ev) => {
  // Delegate event to the selected predictor.
  // Create a state branch for the selector if one does not yet exist.
  //
  const memory = state.timeline.memory
  const currentId = state.predictors.currentId

  const reducer = collection.getPredictor(currentId).reduce
  const oldPredictorState = state.predictors[currentId] // can be undefined
  const nextPredictorState = reducer(oldPredictorState, memory, ev)

  if (nextPredictorState !== oldPredictorState) {
    // Copy probabilties from the local state to ease read for timeline render.
    const update = {}
    update[currentId] = nextPredictorState

    return Object.assign({}, state, {
      predictors: Object.assign({}, state.predictors, update)
    })
  }

  // Else no changes
  return state
}

module.exports = (state, ev) => {
  // Init default
  if (!state.predictors) {
    state = Object.assign({}, state, {
      predictors: {
        currentId: collection.DEFAULT_PREDICTOR,
        prediction: way.fill(state.timeline.memory, 0),
        progress: 0,
        trained: false,
        trainedPredictor: collection.DEFAULT_PREDICTOR,
        trainedModel: {}
      }
    })
  }

  // Call selector reducer and then predictor reducer.
  // The selector reducer handles predictor switch.
  // The delegate inits possibly null predictor model and
  // handles possible model parameter and analyzer events.
  state = predictorSelector(state, ev)
  state = delegate(state, ev) // TODO make lighter

  switch (ev.type) {
    case 'TRAIN_PROGRESS': {
      return Object.assign({}, state, {
        predictors: Object.assign({}, state.predictors, {
          progress: ev.progress
        })
      })
    }

    case 'TRAIN_FINISH': {
      return Object.assign({}, state, {
        predictors: Object.assign({}, state.predictors, {
          progress: 1.0,
          trained: true,
          trainedPredictor: ev.predictorId,
          trainedModel: ev.model
        })
      })
    }

    case 'INFER_CELLS': {
      if (state.predictors.trained) {
        // Extract the event
        const cells = ev.cells
        // Get the trained predictor
        const predictorId = state.predictors.trainedPredictor
        const predictor = collection.getPredictor(predictorId)
        const memory = state.timeline.memory
        const model = state.predictors.trainedModel
        // Get the virtual memory. Will be updated in-place during prediction.
        const virtual = way.clone(state.predictors.prediction)
        // Predict cells and update virtual memory along the way.
        cells.forEach(cell => {
          // Infer.
          const inference = predictor.infer(model, cell, memory, virtual)
          // Update virtual for the next round.
          virtual[cell.channel][cell.time] = inference.prediction
        })
        return Object.assign({}, state, {
          predictors: Object.assign({}, state.predictors, {
            prediction: virtual
          })
        })
      }
      return state
    }

    default:
      return state
  }
}
