const way = require('senseway')

module.exports = (local, memory) => {
  const fieldLen = local.fieldLength
  const fieldWidth = way.width(memory)

  // Base rate
  const sums = way.sums(memory)
  const sumsAbs = way.sumsAbs(memory)
  const priors = way.map2(sums, sumsAbs, (a, b) => {
    return b > 0 ? a / b : 0
  })

  // How the field is positioned on the conditioned element?
  // Offset of 0 means that the element is on the oldest row
  // and that the field is towards future.
  const fieldOffset = local.fieldOffset
  const slices = way.slices(memory, fieldLen, fieldOffset)

  // Build conditioned fields by going through each slice.
  // The fields resemble probabilities given the target.
  const accInit = memory.map(ch => {
    return {
      posSumField: way.create(fieldWidth, fieldLen, 0),
      posAbsField: way.create(fieldWidth, fieldLen, 0),
      negSumField: way.create(fieldWidth, fieldLen, 0),
      negAbsField: way.create(fieldWidth, fieldLen, 0)
    }
  })
  const sumQuads = slices.reduce((acc, slice) => {
    return acc.map((vs, c) => {
      // Value of the conditioning cell in this slice.
      const target = slice[c][-fieldOffset]
      // if target=1 let us add values to sumField
      if (target > 0) {
        return {
          posSumField: way.add(vs.posSumField, slice),
          posAbsField: way.add(vs.posAbsField, way.abs(slice)),
          negSumField: vs.negSumField,
          negAbsField: vs.negAbsField
        }
      }
      if (target < 0) {
        return {
          posSumField: vs.posSumField,
          posAbsField: vs.posAbsField,
          negSumField: way.add(vs.posSumField, slice),
          negAbsField: way.add(vs.posAbsField, way.abs(slice))
        }
      }
      return vs
    })
  }, accInit)

  // Compute value from sums.
  const fields = sumQuads.map(sumQuad => {
    return Object.assign(sumQuad, {
      posField: way.map2(sumQuad.posSumField, sumQuad.posAbsField, (a, b) => {
        return (b > 0) ? a / b : 0
      }),
      negField: way.map2(sumQuad.negSumField, sumQuad.negAbsField, (a, b) => {
        return (b > 0) ? a / b : 0
      })
    })
  })

  // Predict unknowns using the fields.
  const unknowns = way.toArray(memory).filter(cell => cell.value === 0)
  const predicted = unknowns.map(unknownCell => {
    // Find the context ie surroundings of the unknown cell.
    // An example for correct slice positioning:
    //   let fieldLen = 3 and fieldOffset = -1 and u.time = 0.
    //   We expect the context begin at time = -1 and end at time = 2.
    const begin = unknownCell.time + fieldOffset
    const end = unknownCell.time + fieldOffset + fieldLen
    const context = way.slice(memory, begin, end)

    const posField = fields[unknownCell.channel].posField
    const negField = fields[unknownCell.channel].negField
    const posPrior = priors[unknownCell.channel]
    const negPrior = -posPrior

    const posLikelihood = way.reduce(posField, (acc, cond, c, t) => {
      const ctx = context[c][t]
      // if (ctx > 0) the conditional prob ok
      // if (ctx < 0) the conditional prop negated
      const like = cond * ctx
      // 2 * (((acc + 1) / 2) * ((like + 1) / 2)) -1
      // = (acc + 1) * (like + 1) / 2 - 1
      return (acc * like + acc + like - 1) / 2
    }, 1)
    const negLikelihood = way.reduce(negField, (acc, cond, c, t) => {
      const ctx = context[c][t]
      // if (ctx > 0) the conditional prob ok
      // if (ctx < 0) the conditional prop negated
      const like = cond * ctx
      // 2 * (((acc + 1) / 2) * ((like + 1) / 2)) -1
      // = (acc + 1) * (like + 1) / 2 - 1
      return (acc * like + acc + like - 1) / 2
    }, 1)

    // P2(hood|tgt) * P2(tgt)
    const posSupport = posLikelihood * posPrior + posLikelihood + posPrior
    const negSupport = negLikelihood * negPrior + negLikelihood + negPrior

    // Maximum a posteriori
    const argmax = (posSupport > negSupport) ? 1 : -1

    return {
      unknownCell: unknownCell,
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
  }, way.map(memory, q => 0))

  return {
    prediction: predictedMemory,
    fields: fields,
    predictedCells: predicted
  }
}
