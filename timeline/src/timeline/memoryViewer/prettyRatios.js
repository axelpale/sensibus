
// Available numbers
const N = [1, 2, 3, 4, 5, 6, 7, 8, 9]
// Cartesian product as a matrix.
const cartesian = N.map(n => N.filter(m => m > n).map(m => [n, m]))
// Flatten
const availableRatios = cartesian.reduce((arr, row) => arr.concat(row), [])

exports.simplestRatio = (p) => {
  const reals = availableRatios.map(r => r[0] / r[1])
  const diffs = reals.map(x => Math.abs(x - p))
  const idMinDiff = diffs.reduce((ai, d, i) => d < diffs[ai] ? i : ai, 0)
  const rMin = availableRatios[idMinDiff]
  return '' + rMin[0] + '/' + rMin[1]
}

exports.ratio7 = p => {
  // Equivalently weighted 1/7, 2/7, 3/7, 4/7, 5/7, 6/7
  // If p === 1 then 7/7
  // If p === 0 then 0/7
  return Math.ceil(p * 6) + '/7'
}
