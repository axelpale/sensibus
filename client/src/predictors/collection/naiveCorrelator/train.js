const way = require('senseway')
const nonprogressiveTrain = require('../nonprogressiveTrain')

module.exports = nonprogressiveTrain((config, memory) => {
  // Overview:
  // - Compute average neighborhood for every channel.
  // - Find unknown cells.
  // - For each unknown cell get its neighborhood (context).
  // - Position average neighborhoods on the context.
  // - Combine average neighborhoods to yield prediction for the cell.
  //
  const fieldLen = config.fieldLength
  const fieldWidth = way.width(memory)

  // How the field is positioned on the conditioned element?
  // Offset of 0 means that the element is on the oldest row
  // and that the field is towards future.
  const fieldOffset = config.fieldOffset
  const slices = way.slices(memory, fieldLen, fieldOffset)

  // Build correlation fields by going through each slice.
  // With the fields we can make predictions.
  const accInit = memory.map(ch => {
    return {
      sumField: way.create(fieldWidth, fieldLen, 0),
      sumAbsField: way.create(fieldWidth, fieldLen, 0)
    }
  })
  const sumPairs = slices.reduce((acc, slice) => {
    return acc.map((vs, c) => {
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

  const fields = sumPairs.map(sumPair => {
    return Object.assign(sumPair, {
      valueField: way.map2(sumPair.sumField, sumPair.sumAbsField, (a, b) => {
        return (b > 0) ? a / b : 0
      })
    })
  })

  return {
    fieldLength: config.fieldLength,
    fieldOffset: config.fieldOffset,
    fields: fields
  }
})
