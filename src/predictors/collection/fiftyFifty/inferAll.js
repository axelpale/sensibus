const way = require('senseway')

module.exports = (model, memory) => {
  return {
    prediction: way.map(memory, q => 0)
  }
}
