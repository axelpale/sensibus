
exports.createObserver = (selectors) => {
  // Redux helper. Return true if one or more of the selected values changed.
  //
  // Usage:
  //   const channelTitlesChanged = createObserver([
  //     state => state.timeline.select,
  //     state => state.timeline.channels
  //   ])
  //   ...
  //   if (channelTitlesChanged(state)) {
  //     channelTitles.update(state, dispatch)
  //   }
  let prevValues = []

  return (state) => {
    const values = selectors.map(selector => selector(state))
    const allSame = values.every((val, i) => val === prevValues[i])
    prevValues = values
    return !allSame
  }
}

exports.listen = (el, query, eventName, handler) => {
  el.querySelector(query).addEventListener(eventName, handler)
}
