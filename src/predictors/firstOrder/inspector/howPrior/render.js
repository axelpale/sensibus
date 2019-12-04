const way = require('senseway')
const pat = require('sensepat')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {
  const timelinePat = pat.mixedToPattern(model.timeline)

  const avg = pat.mean(timelinePat).value.map(ch => ch[0])

  const canvas = way.first(model.timeline, 5)
  const priorHood = way.map(canvas, (q, c) => avg[c])

  return wayElem(priorHood, {
    reversed: true,
    heading: 'Prior Probabilities',
    caption: 'We already know what to expect in general '
      + 'by looking the average of each channel.'
  })
}
