const way = require('senseway')
const buildFields = require('./buildFields')
const sumToProb = require('./sumToProb')
const getMutualInfo = require('./getMutualInfo')
const findBestSubset = require('./findBestSubset')

module.exports = (config, memory) => {
  // How the field is positioned on the conditioned element?
  // Offset of 0 means that the element is on the oldest row
  // and that the field is towards future.
  const fieldLength = config.fieldLength
  const fieldOffset = 1 - fieldLength
  const fieldWidth = way.width(memory)

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

  // Create a dummy field to loop over
  const proto = way.create(fieldWidth, fieldLength, 0)

  // We compute mutual information between all variables only once.
  // The result is a four-dimensional array, a mapping between two fields.
  // OPTIMIZE by noting that many values are equal
  const miFields = way.map(proto, (y, yc, yt) => {
    return way.map(proto, (x, xc, xt) => {
      return getMutualInfo(fields, priors, xc, xt, yc, yt)
    })
  })

  // Find min-redundant-max-relevant feature sets.
  const filtering = priors.map((foo, condChan) => {
    return findBestSubset(priors, fields, miFields, slices, condChan)
  })

  const weights = filtering.map(result => {
    return result.increments[result.bestIncrementAt].subset
  })

  return {
    fieldLength: fieldLength,
    priors: priors,
    fields: fields,
    weights: weights,
    mutualInfos: miFields,
    filtering: filtering
  }
}
