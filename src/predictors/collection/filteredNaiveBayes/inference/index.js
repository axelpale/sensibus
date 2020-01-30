const way = require('senseway')

exports.infer = (prior, field, weight, context) => {
  const posField = field['1'].prob
  const negField = field['-1'].prob
  const posPrior = prior
  const negPrior = 1 - posPrior

  // Prediction p, weighted by mass m of context cell and sample size
  const fac = (condProb, c, t) => {
    const feature = context[c][t] // ternary value
    const p = (feature > 0) ? condProb : 1 - condProb
    const m = Math.abs(feature)
    const s = weight[c][t]
    return Math.pow(p, m * s)
  }

  const posLikelihoodFactors = way.map(posField, fac)
  const negLikelihoodFactors = way.map(negField, fac)

  // Likelihoods
  const posLike = way.reduce(posLikelihoodFactors, (acc, q) => acc * q, 1)
  const negLike = way.reduce(negLikelihoodFactors, (acc, q) => acc * q, 1)

  // P2(hood|tgt) * P2(tgt)
  const posSupport = posLike * posPrior
  const negSupport = negLike * negPrior

  let prediction, posProb, negProb
  if (posSupport === 0 && negSupport === 0) {
    // Undecidable
    posProb = 0.5
    negProb = 0.5
    prediction = 0
  } else {
    // Normalise supports so that their sum becomes 1.
    posProb = posSupport / (posSupport + negSupport)
    negProb = negSupport / (posSupport + negSupport)
    prediction = 2 * posProb - 1 // back to ternary
  }

  // Maximum a posteriori decision
  // const decision = (posSupport > negSupport) ? 1 : -1

  return {
    context: context,
    posFactors: posLikelihoodFactors,
    negFactors: negLikelihoodFactors,
    posPrior: posPrior,
    negPrior: negPrior,
    posSupport: posSupport,
    negSupport: negSupport,
    posProb: posProb,
    negProb: negProb,
    prediction: prediction
  }
}
