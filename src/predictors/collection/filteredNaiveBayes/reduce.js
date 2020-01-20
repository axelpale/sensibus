const train = require('./train')
const inferAll = require('./inferAll')
const way = require('senseway')

module.exports = (model, memory, ev) => {
  // Compute prediction
  // TODO do not do at every event
  // Default
  if (!model) {
    model = {
      fieldLength: 5,
      fields: [],
      priors: [],
      prediction: way.fill(memory, 0)
    }
  }

  switch (ev.type) {
    case 'SELECT_FIELD_LENGTH':
      model = Object.assign({}, model, {
        fieldLength: ev.length
      })
      model = Object.assign({}, model, train(model, memory))
      return Object.assign({}, model, inferAll(model, memory))

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
      // OPTIMIZE only predict on CREATE_CHANNEL and CREATE_FRAME

    default:
      return model
  }
}
