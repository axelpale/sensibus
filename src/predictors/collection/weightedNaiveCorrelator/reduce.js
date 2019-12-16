const predict = require('./predict')

module.exports = (local, memory, ev) => {
  // Compute prediction
  // TODO do not do at every event
  // Default
  if (!local) {
    local = {
      fieldLength: 5,
      fieldOffset: -3,
      weightFactor: 0.5
    }
  }

  switch (ev.type) {
    case 'SELECT_FIELD_LENGTH':
      local = Object.assign({}, local, {
        fieldLength: ev.length
      })
      return Object.assign({}, local, predict(local, memory))

    case 'SELECT_FIELD_OFFSET':
      local = Object.assign({}, local, {
        fieldOffset: ev.offset
      })
      return Object.assign({}, local, predict(local, memory))

    case 'SELECT_WEIGHT_FACTOR':
      local = Object.assign({}, local, {
        weightFactor: ev.factor
      })
      return Object.assign({}, local, predict(local, memory))

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
      return Object.assign({}, local, predict(local, memory))

    default:
      return local
  }
}
