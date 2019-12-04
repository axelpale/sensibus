module.exports = (pat) => {
  // Sum weighted values together.
  return pat.value.reduce((acc, ch, c) => {
    return ch.reduce((ac, q, t) => {
      return ac + q * pat.mass[c][t]
    }, acc)
  }, 0)
}
