const findBestIncrement = require('./findBestIncrement')

module.exports = (priors, fields, miFields, slices, condChan) => {
  // Find a good feature subset quickly with mRMR filter.
  // TODO wrapper that optimises the subset in a slow way.
  return findBestIncrement(priors, fields, miFields, slices, condChan)
}
