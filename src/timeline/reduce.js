const defaultTimeline = require('./defaultTimeline')
const channelEditor = require('./channelEditor/reduce')
const channelTitles = require('./channelTitles/reduce')
const wayViewer = require('./wayViewer/reduce')
const way = require('senseway')

const reducer = (state, ev) => {
  switch (ev.type) {
    case '__INIT__': {
      // Default timeline
      return Object.assign({}, state, {
        timeline: defaultTimeline
      })
    }

    case 'CREATE_CHANNEL': {
      const sizeReference = way.channel(state.timeline.way, 0)
      const newChannel = way.fill(sizeReference, null)
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          way: way.mix(newChannel, state.timeline.way),
          channels: [].concat([{
            title: '?',
            backgroundColor: '#8A1C82'
          }], state.timeline.channels),
          channelOnEdit: 0 // Open name edit input
        })
      })
    }

    case 'CREATE_FRAME': {
      const sizeReference = way.frame(state.timeline.way, 0)
      const newFrame = way.fill(sizeReference, null)
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

    default: {
      return state
    }
  }
}

module.exports = (state, ev) => {
  return [
    reducer,
    channelEditor,
    channelTitles,
    wayViewer
  ].reduce((acc, re) => {
    return re(acc, ev)
  }, state)
}
