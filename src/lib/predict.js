const way = require('senseway')
const pat = require('sensepat')

module.exports = (state, channel, time) => {
  // Find probability for 1 in the given cell position,
  // given the history.
  //
  // Params
  //   ...
  //   time, time in history
  //
  // Returns
  //   probability for 1
  const timeline = state.timeline
  const timelinePat = pat.mixedToPattern(timeline.way)
  const prior = pat.mean(timelinePat).value.map(ch => ch[0])
  const w = way.width(timeline.way)
  const ctxlen = state.contextLength

  const c = channel
  const t = time

  const zeroPat = pat.single(w, ctxlen, c, 0)
  const onePat = pat.single(w, ctxlen, c, 1)

  const zeroMean = pat.contextMean(timelinePat, zeroPat)
  const oneMean = pat.contextMean(timelinePat, onePat)
  // Now, oneMean gives probability for 1 at context, given 1 at same
  // relative position.

  const priorMean = {
    value: way.map(zeroMean.value, (q, c) => prior[c]),
    mass: way.map(zeroMean.value, q => 1)
  }

  const zeroGain = pat.infoGain(priorMean, zeroMean)
  const oneGain = pat.infoGain(priorMean, oneMean)

  const ctxCurr = pat.sliceAround(timelinePat, ctxlen, t)

  const cellFactor = (mv, mm, cv, cm, pr, qc, qt) => {
    // Returns a likelihood multiplier
    //
    // mv, mean value
    // mm, mean mass i.e. sample size
    // cv, current value
    // cm, current mass, q in range [0, 1]
    // pr, prior probability for the cell (qc, qt) being 1
    // qc, channel of the cell
    // qt, time of the cell
    //
    if (mm * cm < 0.0001) {
      // No mass, no effect
      return 1
    }

    if (qc === c && qt === t) {
      // No autoeffect. P(A|A) = P(A)
      return 1
    }

    let factor
    if (cv < 0.5) {
      // 0 in context at this point. B=0
      // P(B=0) = 1 - P(B=1)
      if (1 - pr < 0.0001) {
        // Should not happen. 100% prior but still B=0
        console.error('should not happen')
        return 0
      }
      // In average here is 1 at probability pr.
      // In other words, here is 0 at 1-pr.
      // In average given Pat, here is 1 at probability of mv.
      // In other words, here is 0 at probability 1-mv given Pat.
      // If the conditional prob for B=0 is greater than prior for B=0,
      // there is some dependency between Pat and B that supports B=0.
      // If P(B=0|A=x) < P(B=0) then it is less likely that A=x.
      factor = (1 - mv) / (1 - pr)
    } else {
      // B=1
      if (pr < 0.0001) {
        // Should not happen. 0% prior but still B=1
        console.error('should not happen')
        return 0
      }
      // P(B=1|A=x) = P(B=1) => A and B are independent. No change.
      factor = mv / pr
    }

    return factor

    // Take sample size into consideration.
    // Error of the sample mean is propotional to pop_mean / sqrt(sample_size)
    // Let us use sqrt(sample_size) as a weight.
    // Because we need to return only a likelihood factor
    // and not the true probability, the weight can be in arbitrary scale.
    // const power = Math.sqrt(mm) / Math.sqrt(LEN)
    //
    // // Tryout #1
    // // Works badly when extreme mv (0 or 1) because forces likelihood to zero.
    // // const weightedProb = Math.pow(prob, power)
    //
    // // Tryout #2
    // const priorPower = 1 - power
    // const weightedProb = power * factor + priorPower * (cv < 0.5 ? 1 - pr : pr)
    //
    // return Math.pow(weightedProb, power)
  }

  const zeroField = way.map(zeroMean.value, (q, qc, qt) => {
    const mv = q // P(B=1|A=0)
    const mm = zeroMean.mass[qc][qt]
    const cv = ctxCurr.value[qc][qt] // B
    const cm = ctxCurr.mass[qc][qt]
    const pri = prior[qc] // P(B=1)

    const factor = cellFactor(mv, mm, cv, cm, pri, qc, qt)
    return factor
  })
  const oneField = way.map(oneMean.value, (q, qc, qt) => {
    const mv = q // P(B=1|A=1)
    const mm = oneMean.mass[qc][qt]
    const cv = ctxCurr.value[qc][qt] // B
    const cm = ctxCurr.mass[qc][qt]
    const pri = prior[qc] // P(B=1)

    const factor = cellFactor(mv, mm, cv, cm, pri, qc, qt)
    return factor
  })

  const zeroLikelihood = way.reduce(zeroField, (acc, p) => {
    return acc * p
  }, 1 - prior[c]) // P(A | B)
  const oneLikelihood = way.reduce(oneField, (acc, p) => {
    return acc * p
  }, prior[c]) // P(A | B)

  // If zeroProb and oneProb are about same, the prior should be returned.
  // Also if no information, use prior.
  let prob
  if (zeroLikelihood + oneLikelihood > 0) {
    prob = oneLikelihood / (zeroLikelihood + oneLikelihood)
  } else {
    prob = prior[c]
  }

  // Prediction
  return {
    channel: channel,
    context: ctxCurr,
    contextMean: oneMean,
    contextPrior: priorMean,
    contextGain: oneGain,
    oneField: oneField,
    oneGain: oneGain,
    oneLikelihood: oneLikelihood,
    oneMean: oneMean,
    probField: oneField,
    prob: prob,
    priorMean: priorMean,
    priorProb: prior[c],
    time: time,
    zeroField: zeroField,
    zeroGain: zeroGain,
    zeroLikelihood: zeroLikelihood,
    zeroMean: zeroMean
  }
}
