const way = require('senseway')

module.exports = (history, values, mask) => {
  // Sum over history
  //
  // Params:
  //   history, a way. Full history where to search the pattern.
  //   values, a way. Values for the pattern.
  //   mask, a way. Which values of the pattern are meaningful
  //

  if (way.len(values) !== way.len(mask)) {
    throw new Error('Way length mismatch. Values and mask must be same size.')
  }

  // Lengths
  const len = way.len(mask)
  const hlen = way.len(history)

  // Compute mask mass to compare later how perfectly a time slice matches.
  const maskMass = way.sum(mask)

  // We add up the matching parts of the history to see what
  // happens around the pattern. Let us init the sum with zeros.
  let sliceSum = way.map(mask, q => 0)
  let supportSum = way.map(mask, q => 0)

  for (let t = -len; t < hlen; t += 1) {
    // Take a slice of history at time t.
    let tslice = way.slice(history, t, t + len)
    let tsliceLen = len

    // A mask for this t.
    let tmask = mask

    // To deal with the edges: a mask for support;
    // did cell participate to to sliceSum.
    // Cell-wise normalisation.
    let supportMask = way.map(mask, q => 1)

    // We do not want bias near the edges.
    // Deal with the edges by padding the slice so that size matches the mask.
    // The equal sizes are needed for math operations.
    // However we do not want the padded values have any weight.
    // Therefore we mask the padded values out
    // by setting this area in mask to zero.
    // We also keep track of normalising factor for every cell.
    if (t < 0) {
      // Pad at begin
      tmask = way.slice(tmask, -t, len)
      // For example, with mask length 4:
      //   t = -4: slice(tmask, 4, 4)
      //   t = -2: slice(tmask, 2, 4)
      //   t = 0: slice(tmask, 0, 4)
      supportMask = way.slice(supportMask, -t, len)
    } else if (t > hlen - len) {
      // For example, len = 4, hlen = 8:
      //   t = 4: 4 > 8 - 4 === false
      //   t = 5: 5 > 8 - 4 === true

      // Pad at end
      tmask = way.slice(tmask, 0, hlen - t)
      // For example, len = 4, hlen = 8:
      //   t = 5: slice(tmask, 0, 3)
      //   t = 7: slice(tmask, 0, 1)
      //   t = 8: slice(tmask, 0, 0)
      supportMask = way.slice(supportMask, 0, hlen - t)
    }

    // Compute how much the slice resembles the pattern.
    // 0 & 0 => 1
    // 0 & 1 => 0
    // 1 & 1 => 1
    // 0.5 & 0.5 => 1
    const match = way.map2(values, tslice, (a, b) => 1 - Math.abs(a - b))
    // Mask out those resemblances that are not part of the pattern.
    // We do not care about them.
    const masked = way.map2(match, tmask, (d, m) => d * m)
    // Measure how much the slice resembles the pattern
    // by summing up the matches after masking.
    let support = way.sum(masked)

    // If the pattern exists in the slice, support is high.
    // To make things more crispier, we use only perfect matches.
    if (support === maskMass) {
      // Probability sum
      sliceSum = way.add(sliceSum, tslice)
      // Weight sum
      supportSum = way.add(supportSum, supportMask)
    }
  }

  // Normalise to get the weighted average.
  let sliceAverage = way.map2(sliceSum, supportSum, (sli, sup) => {
    // Take care of possible division by zero.
    return sup > 0 ? sli / sup : 0
  })

  // If sum of support is 0, there is absolutely no matching pattern.
  // Then we just need to use our best knowledge, a priori.
  if (way.sum(supportSum) === 0) {
    const prior = way.mean(history)
    // Stretch the priori
    sliceAverage = way.map(sliceAverage, (zero, c) => prior[c][0])
  }

  return {
    values: sliceAverage,
    mask: supportSum
  }
}
