module.exports = (pat) => {
  return pat.value.reduce((acc, ch, c) => ch.reduce((ac, q, t) => {
    ac.push({
      channel: c,
      time: t,
      value: q,
      mass: pat.mass[c][t]
    })
    return ac
  }, acc), [])
}
