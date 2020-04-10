// mRMR omega range selector.
// Find such stable subsequence in the sequence of feature increments
// that is both high in validation score and low in score variance.

module.exports = (scorings) => {
  const subseqRecords = []

  const seqSize = scorings.length
  const subseqSize = Math.min(Math.ceil(seqSize / 5), 5)

  // Subseq range begin and end
  let a = 0 // inclusive
  let b = subseqSize // exclusive

  while (b <= seqSize) {
    // Mean
    let meanSum = 0
    for (let i = 0; i < b - a; i += 1) {
      meanSum += scorings[a + i].score
    }
    const subseqMean = meanSum / (b - a)

    // Variance
    let varSum = 0
    for (let i = 0; i < b - a; i += 1) {
      const diff = scorings[a + i].score - subseqMean
      varSum += diff * diff
    }
    const subseqVar = varSum / (b - a)

    // Feature set size penalty
    const penalty = 0.0001 * a

    // Score
    const quality = subseqMean - subseqVar - penalty

    // Record for inspection
    subseqRecords.push({
      begin: a,
      end: b,
      mean: subseqMean,
      variance: subseqVar,
      penalty: penalty,
      quality: quality
    })

    // Next subsequence
    a = b
    b = b + subseqSize
    // Extend the last subsequence to the end.
    // Note the first predicate. Endless loop without it
    // because b=seqSize always fulfills the while-loop condition.
    if (b < seqSize && b + subseqSize > seqSize) {
      b = seqSize
    }
  }

  return subseqRecords
}
