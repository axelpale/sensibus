const way = require('senseway')

module.exports = (state, ev) => {
  switch (ev.type) {

    case 'RESET_TIMELINE': {
      return Object.assign({}, state, {
        timeline: {
          version: 1,
          meta: {
            channels: [
              { title: 'Channel A' },
              { title: 'Channel B' }
            ],
            frames: [
              { title: 'Frame 1' },
              { title: 'Frame 2' }
            ]
          },
          frames: [
            [0, 1],
            [1, 0]
          ]
          edit: {
            channel: null,
            frame: null
          },
          select: null
        }
      })
    }

    case 'IMPORT_TIMELINE': {
      return Object.assign({}, state, {
        timeline: ev.timeline
      })
    }

    default:
      return state
  }
}
