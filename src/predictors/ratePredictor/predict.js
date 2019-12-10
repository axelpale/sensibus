const way = require('senseway')

module.exports = (memory) => {
  const sumsPos = way.sumsPos(memory)
  const sumsAbs = way.sumsAbs(memory)

  const probs = way.map2(sumsPos, sumsAbs, (a, b) => a / b)
  const certs = way.map(sumsAbs, q => 1 - (1 / Math.sqrt(q)))

  return {
    prediction: way.map(memory, (q, c) => probs[c][0]),
    certainty: way.map(memory, (q, c) => certs[c][0]),
    probs: probs,
    certs: certs
  }
}
