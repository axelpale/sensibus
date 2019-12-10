const way = require('senseway')

module.exports = (local, memory, ev) => {
  // Compute prediction
  // TODO do not do at every event

  const sumsPos = way.sumsPos(memory)
  const sumsAbs = way.sumsAbs(memory)

  const probs = way.map2(sumsPos, sumsAbs, (a, b) => a / b)
  const certs = way.map(sumsAbs, q => 1 - (1 / Math.sqrt(q)))

  return Object.assign({}, local, {
    prediction: way.map(memory, (q, c) => probs[c][0]),
    certainty: way.map(memory, (q, c) => certs[c][0]),
    probs: probs,
    certs: certs
  })
}
