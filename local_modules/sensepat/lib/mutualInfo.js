const match = require('./match')
const union = require('./union')
const massMatches = require('./massMatches')

module.exports = (history, patA, patB) => {
  // Mutual information between patA and patB, estimated from history.
  const patAB = union(patA, patB)
  const M = massMatches(history, patAB)

  // Find matching slices
  const MA = M.filter(slice => match(slice, patA))
  const MB = M.filter(slice => match(slice, patB))
  const MAB = M.filter(s => match(s, patA) && match(s, patB))
  const MNAB = M.filter(s => !match(s, patA) && match(s, patB))
  const MANB = M.filter(s => match(s, patA) && !match(s, patB))
  const MNANB = M.filter(s => !match(s, patA) && !match(s, patB))

  // Parts of MI
  const pA = MA.length / M.length
  const pB = MB.length / M.length
  const pNA = 1 - pA
  const pNB = 1 - pB

  const pAB = MAB.length / M.length
  const MIAB = pAB > 0 ? pAB * Math.log2(pAB / (pA * pB)) : 0

  const pNAB = MNAB.length / M.length
  const MINAB = pNAB > 0 ? pNAB * Math.log2(pNAB / (pNA * pB)) : 0

  const pANB = MANB.length / M.length
  const MIANB = pANB > 0 ? pANB * Math.log2(pANB / (pA * pNB)) : 0

  const pNANB = MNANB.length / M.length
  const MINANB = pNANB > 0 ? pNANB * Math.log2(pNANB / (pNA * pNB)) : 0

  return MIAB + MINAB + MIANB + MINANB
}
