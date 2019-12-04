const way = require('senseway')

module.exports = (base, pat) => {
  // Does pattern exist in base
  //
  let found = true

  way.each(pat.value, (pv, c, t) => {
    const pm = pat.mass[c][t]
    const bv = base.value[c][t]
    const bm = base.mass[c][t]

    if (pm > 0) {
      if (bm > 0) {
        if (pv !== bv) {
          found = false
        }
      } else {
        found = false
      }
    }
  })

  return found
}
