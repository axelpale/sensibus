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
      sumField: way.create(fieldWidth, fieldLen, 0),
      sumAbsField: way.create(fieldWidth, fieldLen, 0)
    }
  })
  const sumPairs = slices.reduce((acc, slice) => {
    return acc.map((vs, c) => {
      // Value of the conditioning cell in this slice.
      const target = slice[c][-fieldOffset]
      // if target=1 let us add values to sumField
      if (target > 0) {
        return {
          sumField: way.add(vs.sumField, slice),
          sumAbsField: way.add(vs.sumAbsField, way.abs(slice))
        }
      }
      return vs
    })
  }, accInit)

  // Compute value from sums.
  const fields = sumPairs.map(sumPair => {
    return Object.assign(sumPair, {
      valueField: way.map2(sumPair.sumField, sumPair.sumAbsField, (a, b) => {
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

    const pCtxGTgt = fields[unknownCell.channel].valueField
    const prior = priors[unknownCell.channel]

    const likelihood = way.reduce(pCtxGTgt, (product, pGTgt, c, t) => {
      const ctx = context[c][t]
      if (pGTgt > -1 || ctx < 0) {
        // if (ctx > 0) { r = p }
        // if (ctx < 0) { r = -p }
        const r = pGTgt * ctx
        // 2 * (((product + 1) / 2) * ((r + 1) / 2)) -1
        // = (product + 1) * (p + 1) / 2 - 1
        return (product * r + product + r - 1) / 2
      }
      return product
    }, 1)

    // P2(hood|tgt) * P2(tgt)
    const numerator = (likelihood * prior + likelihood + prior - 1) / 2

    // P2(hood)
    const evidence = way.reduce(context, (acc, q, c) => {
      const p = q * priors[c]
      return (acc * p + acc + p - 1) / 2
    }, 1)

    // Dividing ternary probabilities. a / b
    // 2 * ((a + 1) / 2) / ((b + 1) / 2) - 1
    // 2 * (a + 1) / (b + 1) - 1
    // ((2a + 2) - (b + 1)) / (b + 1)
    // (2a - b + 1) / (b + 1)
    let posterior
    if (evidence > -1) {
      posterior = 2 * (numerator + 1) / (evidence + 1) - 1
    } else {
      posterior = prior
    }

    return {
      unknownCell: unknownCell,
      posterior: posterior,
      context: context
    }
  })

  // Lay predictions on a memory-shaped way
  const predictedMemory = predicted.reduce((mem, pred) => {
    const c = pred.unknownCell.channel
    const t = pred.unknownCell.time
    mem[c][t] = pred.posterior
    return mem
  }, way.map(memory, q => 0))

  return {
    prediction: predictedMemory,
    fields: fields,
    predictedCells: predicted
  }
}
