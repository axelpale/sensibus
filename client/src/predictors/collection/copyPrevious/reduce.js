const train = require('./train')
const inferAll = require('./inferAll')
const way = require('senseway')

module.exports = (model, memory, ev) => {
  // Compute prediction
  // TODO do not do at every event
  if (!model) {
    model = {
      prediction: way.fill(memory, 0)
    }
  }

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
    case 'SELECT_PREDICTOR':
      model = Object.assign({}, model, train(model, memory))
      return Object.assign({}, model, inferAll(model, memory))

    default:
      return model
  }
}
