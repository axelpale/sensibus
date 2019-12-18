const way = require('senseway')
const lib = require('./lib')

module.exports = (model, cell, memory) => {
  const posField = model.fields[cell.channel].posField
  const negField = model.fields[cell.channel].negField
  const posPrior = model.priors[cell.channel]
  const negPrior = -posPrior

  const ctxBegin = lib.getBegin(model, cell.time)
  const ctxEnd = lib.getEnd(model, cell.time)
  const context = way.slice(memory, ctxBegin, ctxEnd)

  const posLikelihoodFactors = way.map(posField, (cond, c, t) => {
    const ctx = context[c][t]
    return cond * ctx
  })
  const negLikelihoodFactors = way.map(negField, (cond, c, t) => {
    const ctx = context[c][t]
    return cond * ctx
  })

  // Likelihoods
  const posLike = way.reduce(posLikelihoodFactors, (acc, q) => {
    return (acc * q + acc + q - 1) / 2
  }, 1)
  const negLike = way.reduce(negLikelihoodFactors, (acc, q) => {
    return (acc * q + acc + q - 1) / 2
  }, 1)

  // P2(hood|tgt) * P2(tgt)
  const posSupport = (posLike * posPrior + posLike + posPrior - 1) / 2
  const negSupport = (negLike * negPrior + negLike + negPrior - 1) / 2

  // Maximum a posteriori decision
  const decision = (posSupport > negSupport) ? 1 : -1

  return {
    cell: cell,
    context: context,
    posFactors: posLikelihoodFactors,
    negFactors: negLikelihoodFactors,
    posSupport: posSupport,
    negSupport: negSupport,
    prediction: decision
  }
}
