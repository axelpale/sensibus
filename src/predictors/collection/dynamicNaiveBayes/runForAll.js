const way = require('senseway')

module.exports = (local, memory) => {
  // How the field is positioned on the conditioned element?
  // Offset of 0 means that the element is on the oldest row
  // and that the field is towards future.
  const fieldOffset = local.fieldOffset
  const fieldLen = local.fieldLength

  // Slice navigation.
  // An example for correct slice positioning:
  //   let fieldLen = 3 and fieldOffset = -1 and u.time = 0.
  //   We expect the context begin at time = -1 and end at time = 2.
  const getBegin = t => t + fieldOffset
  const getEnd = t => t + fieldOffset + fieldLen

  // - Predict unknowns by using the priors and conditional fields.
  // - Apply dynamic programming method and include every predicted cell
  //   into the context of the next prediction.
  // - The computation order is important.
  //   The heavier the context, the better the estimate.
  const filter = cell => cell.value === 0
  const unknowns = way.toTimeOrderedArray(memory).filter(filter)
  // OPTIMIZE start search from the middle and avoid going far to light areas.
  const firstCell = unknowns.reduce((acc, cell, i) => {
    const context = way.slice(memory, getBegin(cell.time), getEnd(cell.time))
    const weight = way.sumAbs(context)
    if (weight > acc.weight) {
      return Object.assign({}, cell, {
        weight: weight,
        index: i
      })
    }
    return acc
  }, { weight: -1 })
  // First up, then down from the first cell.
  const orderedUnknowns = [].concat(
    unknowns.slice(0, firstCell.index + 1).reverse(),
    unknowns.slice(firstCell.index + 1)
  )
  // Now unknowns are ordered so that we can predict them dynamically.
  // We need to place the predictions in somewhere.
  const virtual = way.clone(memory)
  // We place the predictions into 'virtual memory'.
  const predicted = orderedUnknowns.map(unknownCell => {
    // Find the context ie surroundings of the unknown cell.
    const t = unknownCell.time
    const context = way.slice(virtual, getBegin(t), getEnd(t))

    const posField = local.fields[unknownCell.channel].posField
    const negField = local.fields[unknownCell.channel].negField
    const posPrior = local.priors[unknownCell.channel]
    const negPrior = -posPrior

    const posLikelihoodFactors = way.map(posField, (cond, c, t) => {
      const ctx = context[c][t]
      return cond * ctx
    })
    const negLikelihoodFactors = way.map(negField, (cond, c, t) => {
      const ctx = context[c][t]
      return cond * ctx
    })

    const posLikelihood = way.reduce(posLikelihoodFactors, (acc, q) => {
      return (acc * q + acc + q - 1) / 2
    }, 1)
    const negLikelihood = way.reduce(negLikelihoodFactors, (acc, q) => {
      return (acc * q + acc + q - 1) / 2
    }, 1)

    // P2(hood|tgt) * P2(tgt)
    const posSupport = (posLikelihood * posPrior + posLikelihood + posPrior - 1) / 2
    const negSupport = (negLikelihood * negPrior + negLikelihood + negPrior - 1) / 2

    // Maximum a posteriori
    const argmax = (posSupport > negSupport) ? 1 : -1

    // Insert into the virtual memory to boost next predictions.
    virtual[unknownCell.channel][unknownCell.time] = argmax

    return {
      unknownCell: unknownCell,
      posFactors: posLikelihoodFactors,
      negFactors: negLikelihoodFactors,
      posSupport: posSupport,
      negSupport: negSupport,
      decision: argmax,
      context: context
    }
  })

  // Lay predictions on a memory-shaped way
  const predictedMemory = predicted.reduce((mem, pred) => {
    const c = pred.unknownCell.channel
    const t = pred.unknownCell.time
    mem[c][t] = pred.decision
    return mem
  }, way.clone(local.prediction))

  return {
    prediction: predictedMemory,
    predictedCells: predicted
  }
}
