
// Available numbers
const N = [1, 2, 3, 4, 5, 6, 7, 8, 9]
// Cartesian product as a matrix.
const cartesian = N.map(n => N.filter(m => m > n).map(m => [n, m]))
// Flatten
const availableRatios = cartesian.reduce((arr, row) => arr.concat(row), [])

module.exports = (p) => {
  const reals = availableRatios.map(r => r[0] / r[1])
  const diffs = reals.map(x => Math.abs(x - p))
  const idMinDiff = diffs.reduce((ai, d, i) => d < diffs[ai] ? i : ai, 0)
  const rMin = availableRatios[idMinDiff]
  return '' + rMin[0] + '/' + rMin[1]
}
