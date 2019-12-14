const predict = require('./predict')

module.exports = (local, memory, ev) => {
  // Compute prediction
  // TODO do not do at every event
  if (!local) {
    local = {}
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
      return Object.assign({}, local, predict(local, memory))

    default:
      return local
  }
}
