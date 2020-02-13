const newTimeline = require('./newTimeline')
const migrate = require('../migrate')

module.exports = (state, ev) => {
  switch (ev.type) {
    case 'RESET_STATE': {
      return Object.assign({}, state, {
        timeline: newTimeline,
        sidebarPage: 'edit'
      })
    }

    case 'IMPORT_STATE': {
      // TODO support import from version 0
      const validState = migrate(ev.state)
      return Object.assign({}, state, validState)
    }

    default:
      return state
  }
}
