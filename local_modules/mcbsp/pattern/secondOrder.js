const informationGain = require('./informationGain')
const way = require('senseway')

const findMatches = (history, pattern) => {
  // Times where the pattern can be found from the history.
  //
  // Parameters:
  //   history
  //   pattern: { values, mask }
  //
  // NOTE: Best results when the pattern is tight i.e. way.trim has no effect.

  const vals = pattern.values
  const mask = pattern.mask
  const len = way.len(pattern.mask)
  const hlen = way.len(history)
  const width = way.width(history)

  // Collect times in history here
  const times = []

  // For each point in time
  for (let ht = 0; ht < hlen - len + 1; ht += 1) {
    let match = true
    // For each cell in pattern
    for (let c = 0; match && c < width; c += 1) {
      for (let t = 0; match && t < len; t += 1) {
        if (mask[c][t] > 0.5) {
          if (history[c][ht + t] !== vals[c][t]) {
            match = false
          }
        }
      }
    }
    // Note if pattern is empty, match === true
    if (match) {
      times.push(ht)
    }
  }

  return times
}

const maxNumOfMatches = (history, pattern) => {
  // If the pattern would match at every t, how many matches it would yield.
  //
  // For example:
  //   4-frame history, 1-frame pattern => max 4
  //   4-frame history, 2-frame pattern => max 3

  // Take care of case where pattern is longer than history.
  return Math.max(0, way.len(history) - way.len(pattern.mask) + 1)
}

const secondOrderMasks = (width, len) => {
  // Find every 2nd-order pattern within the context.
  // We only need to create masks, context provides the values.
  const masks = []

  for (let ca = 0; ca < width; ca += 1) {
    for (let ta = 0; ta < len; ta += 1) {
      for (let cb = ca; cb < width; cb += 1) {
        for (let tb = ta; tb < len; tb += 1) {
          // Prevent first order masks
          if (ca !== cb || ta !== tb) {
            let mask = way.create(width, len, 0)
            mask[ca][ta] = 1
            mask[cb][tb] = 1
            masks.push(mask)
          }
        }
      }
    }
  }

  return masks
}

exports.patterns = (history, patternLen) => {

  const width = way.width(history)
  const hlen = way.len(history)
  const len = patternLen
  const context = way.last(history, len)
  const prior = way.mean(history)

  const masks = secondOrderMasks(width, len)

  return masks.map(mask => {
    const patt = {
      values: context,
      mask: mask
    }
    const times = findMatches(history, patt)
    const maxTimesLength = maxNumOfMatches(history, patt)
    const patternProbability = times.length / maxTimesLength

    const slices = times.map(t => {
      return way.slice(history, t, t + len)
    })
    const avgSlice = way.average(slices)
    const gainToPrior = informationGain(prior, avgSlice)

    return {
      pattern: patt,
      prob: patternProbability,
      average: avgSlice,
      gain: gainToPrior
    }
  })
}

exports.predict = () => {
  // For every found pattern, compute:
  // - number of occurrences in the history (prior for the pattern)
  // - average around the pattern
  // - deviation from base prior probabilities (dependent)
  // - how much the average differs from the context in general
  // - how much the average of dependent differs from the context
}
