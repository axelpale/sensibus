const patSlice = require('./slice')
const way = require('senseway')

module.exports = (history, pattern) => {
  // Length of the result is the maximum number of matches
  // the pattern can get regardless the value of the history
  // or the pattern.
  // In other words, answers how many places the pattern mass fits.

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

  for (let t = -plen; t < hlen; t += 1) {
    // Take a slice of history at time t.
    const HS = patSlice(H, t, t + plen)

    let fits = true
    way.each(P.mass, (pm, c, t) => {
      if (pm > 0 && HS.mass[c][t] === 0) {
        fits = false
      }
    })

    if (fits) {
      matchedSlices.push({
        value: HS.value,
        mass: HS.mass,
        time: t
      })
    }
  }

  return matchedSlices
}
