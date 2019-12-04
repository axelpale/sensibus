const way = require('senseway')
const pat = require('sensepat')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {
  const w = way.width(model.timeline)
  const ctxlen = model.contextLength
  const c = model.select.channel
  const single = pat.single(w, ctxlen, c, 1)
  const ctxWindow = way.negate(single.mass)

  return wayElem(ctxWindow, {
    reversed: true,
    heading: 'Context Window',
    caption: 'We inspect certain area around each event.'
  })
}
