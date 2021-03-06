const way = require('senseway')
const lib = require('./lib')

module.exports = (model, cell, memory, virtual) => {
  const posField = model.fields[cell.channel].posField
  const negField = model.fields[cell.channel].negField
  const posPrior = (1 + model.priors[cell.channel]) / 2
  const negPrior = 1 - posPrior

  const ctxBegin = lib.getBegin(model, cell.time)
  const ctxEnd = lib.getEnd(model, cell.time)
  const evidentContext = way.slice(memory, ctxBegin, ctxEnd)
  const virtualContext = way.slice(virtual, ctxBegin, ctxEnd)
  const context = way.map2(evidentContext, virtualContext, (eq, vq) => {
    // Fill gaps in evidence with simulated evidence
    return (eq === 0) ? vq : eq
  })

  // Prediction p, weighted by mass m of context cell and sample size
  const fac = (avg, c, t) => {
    const ctx = context[c][t]
    const p = (1 + (ctx > 0 ? avg : -avg)) / 2
    const m = Math.abs(ctx)
    const s = model.weights[c]
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
    prediction = 2 * posProb - 1 // ternary
  }

  // Maximum a posteriori decision
  // const decision = (posSupport > negSupport) ? 1 : -1

  return {
    cell: cell,
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
