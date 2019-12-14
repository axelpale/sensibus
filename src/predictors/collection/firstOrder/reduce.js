const predict = require('./predict')

module.exports = (local, memory, ev) => {
  // Compute prediction
  // TODO do not do at every event
  return Object.assign({}, local, predict(local, memory))
}
