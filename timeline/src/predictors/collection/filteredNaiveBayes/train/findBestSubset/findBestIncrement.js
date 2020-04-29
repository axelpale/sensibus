const scoreIncrement = require('./scoreIncrement')
const findIncrements = require('./findIncrements')
const findSubsequences = require('./findSubsequences')

module.exports = (priors, fields, miFields, slices, condChan) => {
  // Find mRMR increments
  const increments = findIncrements(miFields, condChan)

  // Score increments with MCC
  const scorings = increments.map((increment, i) => {
    return scoreIncrement(priors, fields, slices, condChan, increment)
  })

  // Find a good and stable subsequence of scores.
  const subseqs = findSubsequences(scorings)
  let bestSubseqQuality = -1 // min MCC score
  let bestSubseqAt = 0
  subseqs.forEach((subseq, i) => {
    if (bestSubseqQuality < subseq.quality) {
      bestSubseqQuality = subseq.quality
      bestSubseqAt = i
    }
  })
  const bestSubseq = subseqs[bestSubseqAt]

  // Find the best increment within the best subsequence.
  const bestScorings = scorings.slice(bestSubseq.begin, bestSubseq.end)
  let bestIncrementScore = bestScorings[0].score
  let bestIncrementAt = bestSubseq.begin
  bestScorings.forEach((scoring, j) => {
    if (bestIncrementScore < scoring.score) {
      bestIncrementScore = scoring.score
      bestIncrementAt = bestSubseq.begin + j
    }
  })

  return {
    increments: increments,
    scorings: scorings,
    subsequences: subseqs,
    bestSubseqAt: bestSubseqAt,
    bestIncrementAt: bestIncrementAt
  }
}
