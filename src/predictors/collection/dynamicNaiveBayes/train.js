const way = require('senseway')

module.exports = (config, memory) => {
  // How the field is positioned on the conditioned element?
  // Offset of 0 means that the element is on the oldest row
  // and that the field is towards future.
  const fieldOffset = config.fieldOffset
  const fieldLength = config.fieldLength
  const fieldWidth = way.width(memory)

  // Base rate
  const sums = way.sums(memory)
  const sumsAbs = way.sumsAbs(memory)
  const priors = way.map2(sums, sumsAbs, (a, b) => {
    return b > 0 ? a / b : 0
  }).map(ch => ch[0])

  // Slices to go through
  const slices = way.slices(memory, fieldLength, fieldOffset)

  // To compute posterior probabilities for small sample sizes
  // we need to provide a small initial mass for all conjugate priors.
  // See https://en.wikipedia.org/wiki/Beta_distribution#Bayesian_inference
  // See also Sunrise problem.
  // Let us use channel priors as initial knowledge of mass one.
  const protoAbs = way.create(fieldWidth, fieldLength, 1)
  const protoSum = way.map(protoAbs, (q, c) => priors[c])

  // Build conditioned fields by going through each slice.
  // The fields resemble probabilities given the target.
  const accInit = memory.map(ch => {
    return {
      posSumField: protoSum,
      posAbsField: protoAbs,
      negSumField: protoSum,
      negAbsField: protoAbs
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
          negSumField: way.add(vs.negSumField, slice),
          negAbsField: way.add(vs.negAbsField, way.abs(slice))
        }
      }
      return vs
    })
  }, accInit)

  // Compute value from sums.
  const fields = sumQuads.map((sumQuad, c) => {
    return Object.assign(sumQuad, {
      posField: way.map2(sumQuad.posSumField, sumQuad.posAbsField, (a, b) => {
        return (b > 0) ? a / b : 0
      }),
      negField: way.map2(sumQuad.negSumField, sumQuad.negAbsField, (a, b) => {
        return (b > 0) ? a / b : 0
      })
    })
  })

  return {
    fieldOffset: fieldOffset,
    fieldLength: fieldLength,
    priors: priors,
    fields: fields
  }
}
