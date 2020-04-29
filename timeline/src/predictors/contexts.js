const way = require('senseway')

exports.hood = (memory, t, n) => {
  const begin = t - n
  const end = t + n + 1
  return way.slice(memory, begin, end)
}
