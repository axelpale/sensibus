const defaultTimeline = require('./defaultTimeline')

module.exports = (state, ev) => {
  switch (ev.type) {
    case '__INIT__': {
      // Default timeline
      return Object.assign({}, state, {
        timeline: defaultTimeline
      })
    }

    case 'CREATE_CHANNEL': {
      ev.
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          meta: Object.assign({}, state.timeline.meta, {
            channelOrder: state.timeline.meta.channelOrder
            channels:
          })
        }),
        channels: [].concat([{
          title: '?',
          backgroundColor: '#8A1C82'
        }], model.channels),
        channelOnEdit: 0 // Open name edit input
      })
    }

    case 'CREATE_FRAME': {
      const sizeReference = way.frame(model.timeline, 0)
      const newFrame = way.fill(sizeReference, null)
      return Object.assign({}, model, {
        timeline: way.join(model.timeline, newFrame),
        frames: [].concat(model.frames, [{
          title: '?'
        }]),
        // Open name edit input
        frameOnEdit: way.len(model.timeline)
      })
    }

    default:
      return state
  }
}
