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
  const fieldOffset = -1
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

  // TODO make auto sums unknown

  // // Predict unknowns using the fields.
  // const unknowns = way.toArray(memory).filter(cell => cell.value === 0)
  // const x = unknows.map(cell => {
  //   const begin = cell.time - fieldLen + fieldOffset
  //   const end = cell.time + fieldOffset
  //   const context = way.slice(memory, begin, end)
  //   way.reduce(context, (acc, q, c, t) => {
  //     fields[c] ...
  //   })
  // })

  // Simpler approach: fiels look mostly back.
  // Use single field to check how much it agrees with context.
  // Possibly simple multiplication is wat we need.

  return {
    prediction: way.map(memory, q => 0),
    fields: fields,
    fieldOffset: fieldOffset
  }
}
