const way = require('senseway')

const sumToProb = (sum, sumAbs) => (b > 0) ? (1 + sum / sumAbs) / 2 : 0.5
const probToTrit = p => 2 * p - 1

module.exports = (config, memory) => {
  // How the field is positioned on the conditioned element?
  // Offset of 0 means that the element is on the oldest row
  // and that the field is towards future.
  const fieldOffset = config.fieldOffset
  const fieldLength = config.fieldLength
  const fieldWidth = way.width(memory)
  const fieldSize = fieldLength * fieldWidth
  const proto = way.create(fieldWidth, fieldLength, 0)

  // Base rate
  const sums = way.sums(memory)
  const sumsAbs = way.sumsAbs(memory)
  const priors = way.map2(sums, sumsAbs, sumToProb).map(ch => ch[0])

  // Slices to go through
  const slices = way.slices(memory, fieldLength, fieldOffset)

  // Deal with the sunrise problem by giving a small initial mass.
  // Let us use channel priors as initial knowledge of mass one.
  // This is similar to Laplace smoothing with Jeffreys' prior but
  // adapted for conditional probabilities.
  // See sensibus notes 2020-01-11-19 for details.
  const protoAbs = way.fill(proto, 1)
  const protoSum = way.map(proto, (q, c) => probToTrit(priors[c]))

  // Build conditioned fields by going through each slice.
  // The fields resemble probabilities given the target.
  const accInit = memory.map(ch => {
    return {
      posSumField: protoSum, // sum field given the condition is positive
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

  // Compute conditional probabilities from sums.
  const fields = sumQuads.map((sumQuad, c) => {
    return Object.assign(sumQuad, {
      posField: way.map2(sumQuad.posSumField, sumQuad.posAbsField, sumToProb),
      negField: way.map2(sumQuad.negSumField, sumQuad.negAbsField, sumToProb)
    })
  })

  // Feature selection via mRMR filter.
  // Min-Redundancy - Max-Relevance
  // Here, our field is a set of features we would like to filter.
  // The class is the target cell on which the field is conditioned.
  const klDivergence = (pxgy, px) => {
    // Kullback-Leibler divergence Dkl(Pxgy||Px)
    const pos = pxgy * Math.log2(pxgy / px)
    const neg = (1 - pxgy) * Math.log2((1 - pxgy) / (1 - px))
    return pos + neg
  }
  const mutualInformation = (px, py, pxgy, pxgny) => {
    // Mutual Information I(X;Y)
    return py * klDivergence(pxgy, px) + (1 - py) * klDivergence(pxgny, px)
  }
  // Min-Redundancy
  // Average mutual information between selected features.
  // TODO compute mutualInformations only once.
  // TODO make into function so that can be called with different feat sets.
  const redundancy = way.reduce(proto, (acc, y, yc, yt) => {
    const py = priors[yc]
    return acc + way.reduce(proto, (ac, x, xc, xt) => {
      const px = priors[xc]
      const pxgy = fields[yc].posField[xc][xt]
      const pxgny = fields[yc].negField[xc][xt]
      return ac + mutualInformation(px, py, pxgy, pxgny)
    }, 0)
  }, 0) / (fieldSize * fieldSize)

  const filteredFields = fields.map((fieldSet, yc) => {
    // Target cell prior probability.
    const py = priors[yc]

    // Max-Relevance
    // Sum mutual information between selected features and target class.
    const relevance = way.reduce(fieldSet.posField, (acc, pxgy, xc, xt) => {
      const px = priors[xc]
      const pxgny = fieldSet.negField[xc][xt]
      return acc + mutualInformation(px, py, pxgy, pxgny)
    }, 0) / fieldSize
    // TODO deal with xc==yc && xt==yt

    // TODO maxRel - minRed
  })

  return {
    fieldOffset: fieldOffset,
    fieldLength: fieldLength,
    priors: priors,
    fields: fields
  }
}
