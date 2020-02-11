
exports.createObserver = (selectors) => {
  // Redux helper. Return true if one or more of the selected values changed.
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
