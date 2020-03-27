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
    update.prediction = nextPredictorState.prediction

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
        prediction: way.fill(state.timeline.memory, 0)
      }
    })
  }

  // Call selector reducer and then predictor reducer.
  // The selector reducer handles predictor switch.
  // The delegate inits possibly null predictor model and
  // handles possible model parameter and analyzer events.
  state = predictorSelector(state, ev)
  state = delegate(state, ev) // TODO make lighter

  // Predict if something changes.
  switch (ev.type) {
    case '__INIT__':
    case 'EDIT_CELL':
    case 'CREATE_CHANNEL':
    case 'MOVE_CHANNEL':
    case 'REMOVE_CHANNEL':
    case 'CREATE_FRAME':
    case 'MOVE_FRAME':
    case 'REMOVE_FRAME':
    case 'IMPORT_STATE':
    case 'RESET_STATE':
    case 'SELECT_PREDICTOR': {
      // Get predictor
      const predictorId = collection.getPredictorId(state)
      const predictor = collection.getPredictor(predictorId)
      const predictorModel = state.predictors[predictorId]
      const memory = state.timeline.memory

      // Full training and infer all. TODO make lighter
      const trainedModel = predictor.train(predictorModel, memory)
      const inferModel = predictor.inferAll(trainedModel, memory)
      const postInferModel = Object.assign({}, trainedModel, inferModel)

      // Update predictor model and prediction memory.
      const update = {}
      update[predictorId] = postInferModel
      update.prediction = postInferModel.prediction

      return Object.assign({}, state, {
        predictors: Object.assign({}, state.predictors, update)
      })
    }

    default:
      return state
  }
}
