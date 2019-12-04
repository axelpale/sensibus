const way = require('senseway')

module.exports = (pat, sliceLen, time) => {
  const begin = time - Math.max(0, Math.floor(sliceLen / 2))
  const end = begin + sliceLen
  return {
    value: way.slice(pat.value, begin, end),
    mass: way.slice(pat.mass, begin, end),
    time: begin
  }
}
