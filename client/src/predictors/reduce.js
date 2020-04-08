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
      // Training finished.
      // First, combine config and trained model.
      const config = state.predictors[ev.predictorId]
      const model = Object.assign({}, config, ev.model)
      // Mark training as finished and update the selected model.
      return Object.assign({}, state, {
        predictors: Object.assign({}, state.predictors, {
          progress: 1.0,
          trained: true,
          trainedPredictor: ev.predictorId,
          trainedModel: model
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
        // Get the virtual memory. Will be update in-place during prediction.
        // It is important to make a pass without altering virtual memory,
        // because then cells are more equal and thus the prediction becomes
        // more realistic.
        let virtual = way.fill(memory, 0)
        let virtualNextPass
        for (let i = 0; i < ev.passes; i += 1) {
          // Avoid virtuals becoming same object.
          virtualNextPass = way.clone(virtual)
          // Predict cells and update virtual memory along the way.
          cells.forEach(cell => {
            // Infer.
            const inference = predictor.infer(model, cell, memory, virtual)
            // Update virtual for the next round.
            virtualNextPass[cell.channel][cell.time] = inference.prediction
          })
          // Save the prediction and use it on the next round.
          virtual = virtualNextPass
        }
        return Object.assign({}, state, {
          predictors: Object.assign({}, state.predictors, {
            prediction: virtual
          })
        })
      }
      return state
    }

    case 'CREATE_CHANNEL':
    case 'REMOVE_CHANNEL':
    case 'MOVE_CHANNEL': {
      // Trained model is not valid anymore.
      return Object.assign({}, state, {
        predictors: Object.assign({}, state.predictors, {
          trained: false,
          progress: 0
        })
      })
    }

    default:
      return state
  }
}
