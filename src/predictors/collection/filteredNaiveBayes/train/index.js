const way = require('senseway')
const mutualInfo = require('./mutualInfo')

const sumToProb = (sum, sumAbs) => (b > 0) ? (1 + sum / sumAbs) / 2 : 0.5
const probToTrit = p => 2 * p - 1

module.exports = (config, memory) => {
  // How the field is positioned on the conditioned element?
  // Offset of 0 means that the element is on the oldest row
  // and that the field is towards future.
  const fieldLength = config.fieldLength
  const fieldOffset = 1 - fieldLength
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

  const getCondProb = (varChan, varFrame, condition, condChan, condFrame) => {
    // Get probability at (varChan, varFrame) given
    // condition at (condChan, condFrame).
    // If such probability is outside of fields, undefined is returned.
    //
    const varOffset = varFrame - condFrame // pair length - 1
    const probField = fields[condChan][condition].probField
    const adjustedVarFrame = fieldOffset + varOffset
    const condProb = probField[varChan][adjustedVarFrame]
    return condProb
  }

  const getMutualInfo = (xChan, xFrame, yChan, yFrame) => {
    // Compute mutual information between x and y, I(x;y).
    // We know that symmetry holds I(x;y) = I(y;x).
    // The fields capture at least one of these symmetric identities.
    // To ease computation, we choose the one that we can compute directly.
    let px, py, pxgy, pxgny

    if (Math.abs(xFrame - yFrame) >= fieldLength) {
      // Pattern length too long to fit field. No such pair available.
      return 0
    }

    // Let f = if x|y fits in the field.
    // xFrame = 0, yFrame = 0, fieldLength = 1, fieldOffset = 0 => f = true
    // xFrame = 0, yFrame = 1, fieldLength = 2, fieldOffset = -1 => f = false
    if (yFrame <= xFrame) {
      if (xFrame - yFrame <= fieldLength + fieldOffset - 1)
    }
    if (xFrame - yFrame < fieldLength + fieldOffset) { // TODO check
      // I(x;y)
      px = priors[xChan]
      py = priors[yChan]
      pxgy = getCondProb(xChan, xFrame, '1', yChan, yFrame)
      pxgny = getCondProb(xChan, xFrame, '-1', yChan, yFrame)
    } else if () {
      // I(y;x)
      px = priors[yChan]
      py = priors[xChan]
      pxgy = getCondProb(yChan, yFrame, '1', xChan, xFrame)
      pxgny = getCondProb(yChan, yFrame, '-1', xChan, xFrame)
    }
    // TODO what if pxgy or pxgny is undefined
    return mutualInfo(px, py, pxgy, pxgny)
  }

  // Feature selection via mRMR filter.
  // Min-Redundancy - Max-Relevance
  // Here, our field is a set of features we would like to filter.
  // The class is the target cell on which the field is conditioned.
  //
  // Min-Redundancy
  // Average mutual information between selected features.
  // TODO compute mutualInfos only once.
  // TODO make into function so that can be called with different feat sets.
  const redundancy = way.reduce(proto, (acc, y, yc, yt) => {
    const py = priors[yc]
    return acc + way.reduce(proto, (ac, x, xc, xt) => {
      const px = priors[xc]
      const pxgy = fields[yc].posField[xc][xt]
      const pxgny = fields[yc].negField[xc][xt]
      return ac + mutualInfo(px, py, pxgy, pxgny)
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
      return acc + mutualInfo(px, py, pxgy, pxgny)
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
