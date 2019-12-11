const way = require('senseway')
const pat = require('sensepat')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {
  const c = model.select.channel
  const w = way.width(model.timeline)
  const ctxlen = model.contextLength

  const timelinePat = pat.mixedToPattern(model.timeline)
  const eventPat = pat.single(w, ctxlen, c, 0)

  const ctxMean = pat.contextMean(timelinePat, eventPat)

  return wayElem(ctxMean.value, {
    reversed: true,
    heading: 'Context Mean for 0',
    caption: 'This is how it looks around the event in general ' +
      'if we take an average over every <strong>absence</strong> ' +
      'of our selected event.'
  })
}
