const way = require('senseway')

module.exports = (pat, begin, end) => {
  return {
    value: way.slice(pat.value, begin, end),
    mass: way.slice(pat.mass, begin, end)
  }
}
