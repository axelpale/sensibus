const way = require('senseway')

module.exports = (model, memory) => {
  return {
    prediction: way.map(memory, (q, c, t) => {
      if (q === 0) {
        return way.get(memory, c, t - 1)
      }
      return q
    })
  }
}
