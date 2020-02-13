const way = require('senseway')

module.exports = (model, cell, memory) => {
  let p
  if (cell.value === 0) {
    p = way.get(memory, cell.channel, cell.time - 1)
  } else {
    p = cell.value
  }
  return {
    cell: cell,
    prediction: p
  }
}
