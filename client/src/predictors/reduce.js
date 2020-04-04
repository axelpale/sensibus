const way = require('senseway')
const predictorSelector = require('./predictorSelector/reduce')
const collection = require('./collection')

const delegate = (state, ev) => {
  // Delegate event to the selected predictor.
  // Create a state branch for the selector if one does not yet exist.
  //
  const memory = state.timeline.memory
  const selection = state.predictors.selection

  const reducer = collection.getPredictor(selection).reduce
  const oldPredictorState = state.predictors[selection] // can be undefined
  const nextPredictorState = reducer(oldPredictorState, memory, ev)

  if (nextPredictorState !== oldPredictorState) {
    // Copy probabilties from the local state to ease read for timeline render.
    const update = {}
    update[selection] = nextPredictorState

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
        selection: collection.DEFAULT_PREDICTOR,
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

    case 'INFER_FINISH': {
      // TODO
      return state
    }

    case 'INFER_ALL': {
      if (state.predictors.trained) {
        // Get the trained predictor.
        const predictorId = state.predictors.trainedPredictor
        const predictor = collection.getPredictor(predictorId)
        const model = state.predictors.trainedModel
        const memory = state.timeline.memory
        // Infer.
        const inference = predictor.inferAll(model, memory)
        // Store prediction.
        return Object.assign({}, state, {
          predictors: Object.assign({}, state.predictors, {
            prediction: inference.prediction
          })
        })
      }
      return state
    }

    default:
      return state
  }
}
