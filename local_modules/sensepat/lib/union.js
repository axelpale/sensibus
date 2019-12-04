const way = require('senseway')

module.exports = (patA, patB) => {
  // Overlay the patterns. If a cell has nonzero mass in both patterns,
  // then the value in patA is used.

  const value = way.clone(patB.value)
  const mass = way.map2(patA.mass, patB.mass, (ma, mb, c, t) => {
    if (ma > 0) {
      value[c][t] = patA.value[c][t]
      return ma
    }
    return mb
  })

  return {
    value: value,
    mass: mass
  }
}
