const defaultTimeline = require('./defaultTimeline')
const channelEditor = require('./channelEditor/reduce')
const channelTitles = require('./channelTitles/reduce')
const wayViewer = require('./wayViewer/reduce')
const way = require('senseway')

const reducer = (state, ev) => {
  switch (ev.type) {
    case 'CREATE_CHANNEL': {
      const sizeReference = way.channel(state.timeline.way, 0)
      const newChannel = way.fill(sizeReference, 0)
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          way: way.mix(newChannel, state.timeline.way),
          channels: [].concat([{
            title: '?'
          }], state.timeline.channels),
          channelOnEdit: 0 // Open name edit input
        })
      })
    }

    case 'CREATE_FRAME': {
      const sizeReference = way.frame(state.timeline.way, 0)
      const newFrame = way.fill(sizeReference, 0)
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          way: way.join(state.timeline.way, newFrame),
          frames: [].concat(state.timeline.frames, [{
            title: '?'
          }]),
          // Open name edit input
          frameOnEdit: way.len(state.timeline.way)
        })
      })
    }

    case 'SELECT_NONE': {
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          select: null
        })
      })
    }

    default: {
      return state
    }
  }
}

module.exports = (state, ev) => {
  // Default timeline
  if (!state.timeline) {
    state = Object.assign({}, state, {
      timeline: defaultTimeline
    })
  }

  return [
    reducer,
    channelEditor,
    channelTitles,
    wayViewer
  ].reduce((acc, re) => {
    return re(acc, ev)
  }, state)
}
