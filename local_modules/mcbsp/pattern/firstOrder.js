const averageContext = require('./averageContext')
const informationGain = require('./informationGain')
const way = require('senseway')

exports.patterns = (history, patternLen) => {
  const width = history.length
  const prior = way.mean(history)
  const zeros = way.create(width, patternLen, 0)
  const ones = way.create(width, patternLen, 1)

  // Precompute 1st order patterns.
  // For every channel get a pattern for single zero
  // and a pattern for single one.
  return history.map((ch, c) => {
    // Build mask by setting one cell to one.
    // Note that t=0, thus we get the avgContext
    // towards the future. TODO We might benefit
    // from past context too when weighting how
    // well the pattern matches the context.
    const mask = way.set(zeros, c, 0, 1)

    const avgZero = averageContext(history, zeros, mask)
    const gainZero = informationGain(prior, avgZero.values)
    const avgOne = averageContext(history, ones, mask)
    const gainOne = informationGain(prior, avgOne.values)

    return [
      // Pattern for 0
      {
        source: {
          values: zeros,
          mask: mask
        },
        values: avgZero.values,
        mask: gainZero
      },
      // Pattern for 1
      {
        source: {
          values: ones,
          mask: mask
        },
        values: avgOne.values,
        mask: gainOne
      }
    ]
  })
}

exports.predict = (history, context, distance) => {
  const width = way.width(context)
  const len = way.len(context) + distance
  const firstOrder = exports.patterns(history, len)

  // For every event in the context, select the first order pattern.
  // firstPatterns has dimensions of context.
  // Each element is a pattern { values, mask }.
  const firstPatterns = way.map(context, (q, c, t) => {
    const v = Math.round(q) // To deal with fuzzy binary TODO not needed?
    return Object.assign({
      timeOffset: t
    }, firstOrder[c][v])
  })

  // How much the gain-predicted values resemble the context?
  // We should not trust gains from prediction patterns which
  // do not fit the context.
  // TODO

  // If the patterns give no information about a cell, use its prior prob.
  // Comes into use for example when channel is only 0 or 1.
  const prior = way.mean(history)

  // For each element in prediction we choose a value for witch
  // the average slices given by the first order patterns gave
  // most information. Some vote for 0, others for 1, but the side
  // that the patterns best predict will win.
  const prediction = way.map(way.create(width, len, 0), (q, c, t) => {
    let info = [0, 0] // Information for 0 and 1
    way.each(firstPatterns, (patt) => {
      // Skip averages that begin later
      if (t - patt.timeOffset >= 0) {
        const prob = patt.values[c][t - patt.timeOffset]
        const gain = patt.mask[c][t - patt.timeOffset]

        // Try #1
        // if (gain > maxGain) {
        //   maxGain = gain
        //   valueOfMaxGain = prob
        //
        // Try #2
        // const p = Math.round(prob)
        // info[p] += gain
        //
        // Try #3:
        // info[0] += (1 - prob) * gain
        // info[1] += prob * gain

        // Try #4:
        info[prob < prior[c][0] ? 0 : 1] += gain
      }
    })

    if (info[0] + info[1] === 0) {
      // No information. Use prior.
      return prior[c][0]
    }

    if (info[0] < info[1]) {
      return 1
    }
    return 0
  })

  return prediction
  // Alternative:
  // The values without any support from the patterns should
  // be predicted by the prior distribution.
  // How to mix prior with the predicted?
  //   Try: sum up the masks and invert the values.
  //   Add prior probabilities masked with these values to the result.
}
