const defaultTimeline = require('../timeline/defaultTimeline')

module.exports = (state, ev) => {
  switch (ev.type) {
    case 'RESET_STATE': {
      return Object.assign({}, state, {
        timeline: defaultTimeline
      })
    }

    case 'IMPORT_STATE': {
      // TODO support import from version 0
      return Object.assign({}, state, ev.state)
    }

    case 'CLOSE_SIDEBAR': {
      return Object.assign({}, state, {
        sidebar: false
      })
    }

    case 'OPEN_SIDEBAR': {
      return Object.assign({}, state, {
        sidebar: true
      })
    }

    default:
      return state
  }
}
