const defaultTimeline = require('../timeline/defaultTimeline')

module.exports = (state, ev) => {
  switch (ev.type) {

    case 'RESET_TIMELINE': {
      return Object.assign({}, state, {
        timeline: defaultTimeline
      })
    }

    case 'IMPORT_TIMELINE': {
      // TODO support import from version 0
      return Object.assign({}, state, {
        timeline: ev.timeline
      })
    }

    default:
      return state
  }
}
