const way = require('senseway')

module.exports = (width, patternLength, channel, eventValue) => {
  // Make a context pattern for single atomic event.
  const value = way.create(width, patternLength, eventValue)
  const t = Math.max(0, Math.floor(patternLength / 2))
  const mass = way.set(way.fill(value, 0), channel, t, 1)

  return {
    value: value,
    mass: mass
  }
}
