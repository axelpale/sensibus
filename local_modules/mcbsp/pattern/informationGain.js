const way = require('senseway')

module.exports = (prior, posterior) => {
  // Parameters:
  //   prior
  //     Prior probabilities. Probs for a slice before knowledge about an event.
  //   posterior
  //     Posterior probabilities. Probs for a slice given the event.
  //
  // Returns:
  //   a way, having same sizes as the posterior, where every element
  //   equals the number of bits the event gave about the value of the element.
  //
  // Each element in the average slice tells us the probability of value 1
  // happening on that same position next to where the pattern exists.
  // In other words, the average slice gives the probability distribution
  // given the pattern. This distribution can be used for prediction.

  // However, it does not directly reveal the statistical dependecies between
  // the elements and the pattern. For example, consider a dependent element
  // that occurs rarely and compare it to an independent element (given
  // the pattern) that occurs often. The latter will have higher probability
  // in the average slice.

  // To map the dependencies between elements (i.e. events; random variables)
  // we take into account their probability in general, a priori.
  // If the probability of an element in the avg slice differs from a priori,
  // then the pattern and the element are dependent.

  const gain = way.map(posterior, (pr, c) => {
    // pr = probability of x given y, where y is our pattern
    // pri = probability of x in general
    // NOTE a little bias in prior caused by the edges.
    const pri = prior[c][0]
    // Kullback-Leibler divergence
    const x0 = (pr === 1) ? 0 : (1 - pr) * Math.log2((1 - pr) / (1 - pri))
    const x1 = (pr === 0) ? 0 : pr * Math.log2(pr / pri)
    return x0 + x1
  });

  return gain
}
