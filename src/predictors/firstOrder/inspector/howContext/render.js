const way = require('senseway')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {
  const c = model.select.channel
  const t = model.select.time
  const ctxlen = model.contextLength

  const beg = t - Math.floor(ctxlen / 2)
  const end = t + Math.ceil(ctxlen / 2)

  const context = way.slice(model.timeline, beg, end)

  return wayElem(context, {
    reversed: true,
    heading: 'Context of the Selected',
    caption: 'This is how it looks around the event we selected. '
      + 'We are interested what happened within the window during '
      + 'past events.'
  })
}
