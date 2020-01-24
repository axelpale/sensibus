const way = require('senseway')
const buildFields = require('./buildFields')
const sumToProb = require('./sumToProb')
const getMutualInfo = require('./getMutualInfo')
const getRedundancy = require('./getRedundancy')

module.exports = (config, memory) => {
  // How the field is positioned on the conditioned element?
  // Offset of 0 means that the element is on the oldest row
  // and that the field is towards future.
  const fieldLength = config.fieldLength
  const fieldOffset = 1 - fieldLength
  const fieldWidth = way.width(memory)
  const fieldSize = fieldLength * fieldWidth

  // Base rate
  const sums = way.sums(memory)
  const sumsAbs = way.sumsAbs(memory)
  const priors = way.map2(sums, sumsAbs, sumToProb).map(ch => ch[0])

  // Slices to go through
  const slices = way.slices(memory, fieldLength, fieldOffset)
  // Conditional probability estimates
  const fields = buildFields(slices, priors)

  // Feature selection via mRMR filter.
  // Min-Redundancy - Max-Relevance
  // Here, our context is the set of features we would like to filter.
  // The class is the target cell on which the field is conditioned.

  // Redundancy.
  // Average mutual information between selected features.

  // Create a dummy field to loop over
  const proto = way.create(fieldWidth, fieldLength, 0)

  // We compute mutual information between all variables only once.
  // The result is a four-dimensional array.
  // OPTIMIZE by noting that many values are equal
  const mutualInfos = way.map(proto, (y, yc, yt) => {
    return way.map(proto, (x, xc, xt) => {
      return getMutualInfo(fields, priors, xc, xt, yc, yt)
    })
  })

  // Selected features marked with 1, other with 0.
  const initSubset = way.fill(proto, 1)

  const redundancy = getRedundancy(mutualInfos, initSubset)

  // Relevance.
  // Relevance is computed for each channel and for each value.
  // Sum mutual information between selected features and conditioning cell.

  const relevances = fields.map((channelFields, condChan) => {
    const conditionMIField = mutualInfos[condChan][fieldLength - 1]
    const relevance = way.sum(conditionMIField) / fieldSize
    // TODO deal with xc==yc && xt==yt

    // We arrive to min-redundancy-max-relevance score
    // TODO const mRMRScore = relevance - redundancy

    return relevance
  })

  // TODO find via mRMR
  const weights = priors.map(foo => way.fill(proto, 1))

  return {
    fieldLength: fieldLength,
    priors: priors,
    fields: fields,
    weights: weights,
    mutualInfos: mutualInfos,
    redundancies: priors.map(foo => redundancy),
    relevances: relevances
  }
}
