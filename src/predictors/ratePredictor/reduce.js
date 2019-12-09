const way = require('senseway')

module.exports = (local, memory, ev) => {
  // Compute prediction
  // TODO do not do at every event

  const means = way.mean(memory)

  return Object.assign({}, local, {
    prediction: way.map(memory, (q, c) => means[c]),
    means: means
  })
}
