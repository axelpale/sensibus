const defaultTimeline = require('./defaultTimeline')

module.exports = (state, ev) => {
  switch (ev.type) {
    case '__INIT__': {
      // Default timeline
      return Object.assign({}, state, {
        timeline: defaultTimeline
      })
    }

    default:
      return state
  }
}
