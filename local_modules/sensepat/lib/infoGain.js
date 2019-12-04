const way = require('senseway')
const equalSize = require('./equalSize')

module.exports = (prior, posterior) => {
  // Parameters:
  //   prior
  //     a pat of prior probabilities. Probs before knowledge about an event.
  //   posterior
  //     a pat of posterior probs. Probs given the event.
  //
  // Precondition:
  //   prior and posterior have same size
  //
  // Returns:
  //   a pat, has same sizes as prior and posterior. Every element
  //   equals the number of bits the event gave about the value of the element.
  //
  if (!equalSize(prior, posterior)) {
    throw new Error('Patterns must be same size')
  }

  const gainMass = way.map2(prior.mass, posterior.mass, (m, n) => m * n)
  // NOTE what to do if prior has no mass for something posterior has?

  const gainValue = way.map(prior.value, (pri, c, t) => {
    const pos = posterior.value[c][t]
    // Kullback-Leibler divergence
    const x0 = (pos === 1) ? 0 : (1 - pos) * Math.log2((1 - pos) / (1 - pri))
    const x1 = (pos === 0) ? 0 : pos * Math.log2(pos / pri)
    return x0 + x1
  })

  return {
    value: gainValue,
    mass: gainMass
  }
}
