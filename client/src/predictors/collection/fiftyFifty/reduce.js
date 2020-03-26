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
    default:
      return model
  }
}
