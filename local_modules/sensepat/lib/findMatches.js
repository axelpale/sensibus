const patSlice = require('./slice')
const way = require('senseway')

module.exports = (history, pattern) => {
  // Returns array of pats: slices in history that match the pattern.
  // Each pat has extra property 'time' which tells the position where
  // the pattern was found.
  //
  // Params:
  //   history, a pat. Full history where to search the pattern.
  //   pattern, a pat. The pattern to find.
  //

  // Short alias
  const H = history
  const P = pattern

  // Lengths
  const hlen = way.len(H.value)
  const plen = way.len(P.value)

  if (plen !== way.len(P.mass)) {
    throw new Error('Way length mismatch. Value and mass must be same size.')
  }

  // Collect history slices here
  const matchedSlices = []

  // Number of cells where values should match
  const massTarget = way.sum(P.mass)

  for (let t = -plen; t < hlen; t += 1) {
    // Take a slice of history at time t.
    const HS = patSlice(H, t, t + plen)

    // Only these values of the pattern can be taken into account.
    const massCut = way.map2(HS.mass, P.mass, (m, n) => Math.min(m, n))

    // Compute how much the slice resembles the pattern.
    // 0 & 0 => 1
    // 0 & 1 => 0
    // 1 & 1 => 1
    // 0.5 & 0.5 => 1
    const valueMatch = way.map2(P.value, HS.value, (a, b) => {
      return 1 - Math.abs(a - b)
    })
    // Mask out values that we cannot take into account due to zero mass.
    const matches = way.map2(valueMatch, massCut, (v, m) => v * m)

    // If the pattern can be found in the slice.
    if (way.sum(matches) === massTarget) {
      matchedSlices.push({
        value: HS.value,
        mass: HS.mass,
        time: t
      })
    }
  }

  return matchedSlices
}
