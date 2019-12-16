const way = require('senseway')

module.exports = (local, memory) => {
  // Overview:
  // - Compute average neighborhood for every channel.
  // - Find unknown cells.
  // - For each unknown cell get its neighborhood (context).
  // - Position average neighborhoods on the context.
  // - Combine average neighborhoods to yield prediction for the cell.
  //
  const fieldLen = local.fieldLength
  const fieldWidth = way.width(memory)

  // How the field is positioned on the conditioned element?
  // Offset of 0 means that the element is on the oldest row
  // and that the field is towards future.
  const fieldOffset = local.fieldOffset
  const slices = way.slices(memory, fieldLen, fieldOffset)

  // Build value and mass fields by going through each slice.
  // With the fields we can make predictions.
  const accInit = memory.map(ch => {
    return {
      sumField: way.create(fieldWidth, fieldLen, 0),
      sumAbsField: way.create(fieldWidth, fieldLen, 0)
    }
  })
  const sumPairs = slices.reduce((acc, slice) => {
    return acc.map((vs, c) => {
      // Source, the conditioning cell for the correlations are computed.
      const source = slice[c][-fieldOffset]
      // OPTIMIZE if source == 0 then return vs
      const multiplied = way.map(slice, q => q * source)
      const absolute = way.map(multiplied, q => Math.abs(q))
      // Pile fields by adding the values and masses to previous.
      return {
        sumField: way.add(vs.sumField, multiplied),
        sumAbsField: way.add(vs.sumAbsField, absolute)
      }
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

  const r = local.weightFactor
  const massToWeight = n => r * n ** r - r + 1
  // const massToWeight = n => 1

  // Predict unknowns using the fields.
  // Simple approach: fiels look mostly back.
  // Use single field to check how much it agrees with context.
  // Simple multiply-accumulate is what we need.
  // Weight via massToWeight
  const unknowns = way.toArray(memory).filter(cell => cell.value === 0)
  const predicted = unknowns.map(unknownCell => {
    // Find the context ie surroundings of the unknown cell.
    // An example for correct slice positioning:
    //   let fieldLen = 3 and fieldOffset = -1 and u.time = 0.
    //   We expect the context begin at time = -1 and end at time = 2.
    const begin = unknownCell.time + fieldOffset
    const end = unknownCell.time + fieldOffset + fieldLen
    const context = way.slice(memory, begin, end)

    const valueField = fields[unknownCell.channel].valueField
    const sumAbsField = fields[unknownCell.channel].sumAbsField
    const weightField = way.map(sumAbsField, massToWeight)

    const matches = way.multiply(context, valueField) // support for hypo u=1
    const weightedMatchSum = way.reduce(matches, (acc, match, c, t) => {
      return acc + match * weightField[c][t]
    }, 0)
    const weightedAbsMatchSum = way.reduce(matches, (acc, match, c, t) => {
      return acc + Math.abs(match) * weightField[c][t]
    }, 0)

    const weightedAvg = (weightedAbsMatchSum > 0
      ? weightedMatchSum / weightedAbsMatchSum : 0)

    return {
      unknownCell: unknownCell,
      weightedAvg: weightedAvg, // prediction
      mass: way.sum(sumAbsField), // sample size
      weightedSum: weightedMatchSum,
      weightedSumAbs: weightedAbsMatchSum
    }
  })

  // Lay predictions on a memory-shaped way
  const predictedMemory = predicted.reduce((mem, pred) => {
    const c = pred.unknownCell.channel
    const t = pred.unknownCell.time
    mem[c][t] = pred.weightedAvg
    return mem
  }, way.map(memory, q => 0))

  return {
    prediction: predictedMemory,
    fields: fields
  }
}
