const way = require('senseway')
const pat = require('sensepat')

module.exports = (model, channel, time) => {
  // Find probability for 1 in the given cell X position,
  // given the history.
  //
  // Params
  //   ...
  //   time, time in history
  //
  // Returns
  //   P(X=1)
  //

  const timelinePat = pat.mixedToPattern(model.timeline)
  const prior = pat.mean(timelinePat).value.map(ch => ch[0])
  const W = way.width(model.timeline)
  const LEN = way.len(model.timeline)
  const ctxlen = model.contextLength

  const ctx = pat.sliceAround(timelinePat, ctxlen, time)
  const offset = ctx.time

  // Position of X in the context and pattern.
  const pc = channel
  const pt = time - offset

  const counts = pat.toArray(ctx).filter(cell => {
    return cell.mass > 0 && cell.channel !== pc && cell.time !== pt
  }).map(cell => {
    // Count number of matches.
    const template = way.create(W, ctxlen, 0)

    const mass = way.clone(template)
    mass[pc][pt] = 1
    mass[cell.channel][cell.time] = 1

    // Values
    const v00 = way.clone(template)
    const v01 = way.set(template, cell.channel, cell.time, 1)
    const v10 = way.set(template, pc, pt, 1)
    const v11 = way.set(way.set(template, pc, pt, 1), cell.channel, cell.time, 1)

    // Patterns
    const p00 = { value: v00, mass: mass }
    const p01 = { value: v01, mass: mass }
    const p10 = { value: v10, mass: mass }
    const p11 = { value: v11, mass: mass }

    // Matches
    const m00 = pat.findMatches(timelinePat, p00)
    const m01 = pat.findMatches(timelinePat, p01)
    const m10 = pat.findMatches(timelinePat, p10)
    const m11 = pat.findMatches(timelinePat, p11)

    // Number of possibilities. This depends on pattern length
    // because the edges of the history.
    const n = m00.length + m01.length + m10.length + m11.length

    // Given target = 1: n = m10.length + m11.length
    // Given target = 0: n = m00.length + m01.length

    const ctxv = cell.value

    let support, against
    if (ctxv === 0) {
      support = m10.length
      against = m00.length
    } else {
      support = m11.length
      against = m01.length
    }

    return {
      channel: cell.channel,
      time: cell.time,
      support: support, // support that target is 1
      against: against, // support that target is 0
      total: n // out of n
    }
  })

  // P(X=1|ctx)
  let numerator = 0
  let denominator = 0
  counts.forEach(co => {
    numerator += co.support / co.total
    denominator += (co.support + co.against) / co.total
  })

  let prob
  if (denominator > 0) {
    prob = numerator / denominator
  } else {
    prob = prior[channel]
  }

  // Prediction
  return {
    channel: channel,
    context: ctx,
    prob: prob,
    time: time
  }
}
