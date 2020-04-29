const way = require('senseway')

module.exports = (model, cell, memory, virtual) => {
  let p

  if (cell.value === 0) {
    p = way.get(memory, cell.channel, cell.time - 1)
    if (p === 0) {
      p = way.get(virtual, cell.channel, cell.time - 1)
    }
  } else {
    p = cell.value
  }

  return {
    cell: cell,
    prediction: p
  }
}
