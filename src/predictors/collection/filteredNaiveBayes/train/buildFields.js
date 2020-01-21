/* eslint-disable quote-props */
const way = require('senseway')
const sumToProb = require('./sumToProb')
const probToTrit = p => 2 * p - 1

module.exports = (slices, priors) => {
  const fieldWidth = way.width(slices[0])
  const fieldLength = way.len(slices[0])
  const proto = way.create(fieldWidth, fieldLength, 0)

  // Deal with the sunrise problem by giving a small initial mass.
  // Let us use channel priors as initial knowledge of mass one.
  // This is similar to Laplace smoothing with Jeffreys' prior but
  // adapted for conditional probabilities.
  // See sensibus notes 2020-01-11-19 for details.
  const protoAbs = way.fill(proto, 1)
  const protoSum = way.map(proto, (q, c) => probToTrit(priors[c]))

  // Build conditioned fields by going through each slice.
  // The fields resemble probabilities given the target.
  const accInit = proto.map(ch => {
    return {
      '1': {
        sum: protoSum, // sum field given the condition is positive
        abs: protoAbs
      },
      '-1': {
        sum: protoSum,
        abs: protoAbs
      }
    }
  })
  const sumQuads = slices.reduce((acc, slice) => {
    return acc.map((vs, c) => {
      // Value of the conditioning cell in this slice.
      const condition = slice[c][1 - fieldLength]
      // if condition=1 let us add values to sumField
      if (condition > 0) {
        return {
          '1': {
            sum: way.add(vs['1'].sum, slice),
            abs: way.add(vs['1'].abs, way.abs(slice))
          },
          '-1': vs['-1']
        }
      }
      if (condition < 0) {
        return {
          '1': vs['1'],
          '-1': {
            sum: way.add(vs['-1'].sum, slice),
            abs: way.add(vs['-1'].abs, way.abs(slice))
          }
        }
      }
      // Condition unknown => do not record
      return vs
    })
  }, accInit)

  // Compute conditional probabilities from sums.
  const fields = sumQuads.map((quad, c) => {
    quad['1'].prob = way.map2(quad['1'].sum, quad['1'].abs, sumToProb)
    quad['-1'].prob = way.map2(quad['-1'].sum, quad['-1'].abs, sumToProb)
    return quad
  })

  return fields
}
