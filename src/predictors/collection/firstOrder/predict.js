const way = require('senseway')

module.exports = (memory) => {
  // Overview:
  // - Compute average neighborhood for every channel.
  // - Find unknown cells.
  // - For each unknown cell get its neighborhood (context).
  // - Position average neighborhoods on the context.
  // - Combine average neighborhoods to yield prediction for the cell.
  //
  const fieldLen = 5
  const fieldWidth = way.width(memory)

  // How the field is positioned on the conditioned element?
  // Offset of 0 means that the element is on the oldest row
  // and that the field is towards future.
  const fieldOffset = -fieldLen + 2
  const slices = way.slices(memory, fieldLen, fieldOffset)

  // Build value and mass fields by going through each slice.
  // With the fields we can make predictions.
  const accInit = memory.map(ch => {
    return {
      sumField: way.create(fieldWidth, fieldLen, 0),
      sumAbsField: way.create(fieldWidth, fieldLen, 0)
    }
  })
  const fields = slices.reduce((acc, slice) => {
    const sumPairs = acc.map((vs, c) => {
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
    const sumsWithValue = sumPairs.map(sumPair => {
      return Object.assign(sumPair, {
        valueField: way.map2(sumPair.sumField, sumPair.sumAbsField, (a, b) => {
          return (b > 0) ? a / b : 0
        })
      })
    })
    return sumsWithValue
  }, accInit)

  // TODO make auto sums unknown

  const r = 0.5
  const massToWeight = n => r * n ** r - r + 1
  // const massToWeight = n => 1

  // Predict unknowns using the fields.
  // Simple approach: fiels look mostly back.
  // Use single field to check how much it agrees with context.
  // Simple multiply-accumulate is what we need.
  // Weight via massToWeight
  const unknowns = way.toArray(memory).filter(cell => cell.value === 0)
  const predicted = unknowns.map(unknownCell => {
    const begin = unknownCell.time - fieldLen + fieldOffset - 1
    const end = unknownCell.time + fieldOffset - 1
    const context = way.slice(memory, begin, end)

    const valueField = fields[unknownCell.channel].valueField
    const sumAbsField = fields[unknownCell.channel].sumAbsField
    const matches = way.multiply(context, valueField) // support for hypo u=1
    const weightField = way.map(sumAbsField, massToWeight)

    const weightedMatchSum = way.reduce(matches, (acc, match, c, t) => {
      return acc + match * weightField[c][t]
    }, 0)
    const weightedAbsMatchSum = way.reduce(matches, (acc, match, c, t) => {
      return acc + Math.abs(match) * weightField[c][t]
    }, 0)
    const weightedAvg = weightedMatchSum / weightedAbsMatchSum

    return {
      unknownCell: unknownCell,
      weightedAvg: weightedAvg, // prediction
      mass: way.sum(sumAbsField), // sample size
      weight: weightedAbsMatchSum
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
    fields: fields,
    fieldOffset: fieldOffset
  }
}
