const getCondProb = require('./getCondProb')
const problib = require('problib')
const way = require('senseway')

module.exports = (fields, priors, xChan, xFrame, yChan, yFrame) => {
  // Compute mutual information between x and y, I(x;y).
  // We know that symmetry holds I(x;y) = I(y;x).
  // The fields capture at least one of these symmetric identities.
  // To ease computation, we choose the one that we can compute directly.

  const fieldLength = way.len(fields[0]['1'].prob)
  let px, py, pxgy, pxgny

  if (Math.abs(xFrame - yFrame) >= fieldLength) {
    // Pattern length too long to fit field. No such pair available.
    return 0
  }

  if (yFrame >= xFrame) {
    // I(x;y)
    px = priors[xChan]
    py = priors[yChan]
    pxgy = getCondProb(fields, priors, xChan, xFrame, 1, yChan, yFrame)
    pxgny = getCondProb(fields, priors, xChan, xFrame, -1, yChan, yFrame)
  } else {
    // I(y;x)
    px = priors[yChan]
    py = priors[xChan]
    pxgy = getCondProb(fields, priors, yChan, yFrame, 1, xChan, xFrame)
    pxgny = getCondProb(fields, priors, yChan, yFrame, -1, xChan, xFrame)
  }
  // TODO what if pxgy or pxgny is undefined
  return problib.mutualInfo(px, py, pxgy, pxgny)
}
