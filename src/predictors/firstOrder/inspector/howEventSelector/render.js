const way = require('senseway')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {

  const waySelected = (() => {
    const c = model.select.channel
    const t = model.select.time
    return way.set(way.fill(model.timeline, 0), c, t, 1)
  })()

  const eventSelector = wayElem(model.timeline, {
    reversed: true,
    heading: 'Event to Predict',
    caption: 'We predict the unknown events one by one. '
      + '<strong>Select</strong> an event to see '
      + 'how we form its probability.',
    selected: waySelected
  })

  eventSelector.addEventListener('click', (ev) => {
    const c = parseInt(ev.target.dataset.channel)
    const t = parseInt(ev.target.dataset.time)

    // NaN in case where non-cell was clicked
    if (isNaN(c) || isNaN(t)) {
      return
    }

    dispatch({
      type: 'HOW_EDIT_SELECTED',
      channel: c,
      time: t
    })
  })

  return eventSelector
}
