const way = require('senseway')

module.exports = (mixedWay) => {
  // Mixed way is a way that has null values to denote unknown values
  // i.e. values with zero mass. Here we convert the mixed to explicit
  // value and mass.
  return {
    value: way.map(mixedWay, q => q === null ? 0 : q),
    mass: way.map(mixedWay, q => q === null ? 0 : 1)
  }
}
