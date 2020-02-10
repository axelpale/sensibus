const defaultTimeline = require('./defaultTimeline')
const channelEditor = require('./channelEditor/reduce')
const memoryViewer = require('./memoryViewer/reduce')
const predictNextTitle = require('./predictNextTitle')
const way = require('senseway')

module.exports = (state, ev) => {
  // Default timeline
  if (!state.timeline) {
    state = Object.assign({}, state, {
      timeline: defaultTimeline
    })
  }

  state = channelEditor(state, ev)
  state = memoryViewer(state, ev)

  switch (ev.type) {
    case 'CREATE_CHANNEL': {
      const atC = ev.belowChannel ? ev.belowChannel : 0
      const memory = state.timeline.memory

      const sizeReference = way.channel(memory, 0)
      const newChannel = way.fill(sizeReference, 0)
      const nextMemory = way.insertChannel(memory, atC, newChannel)

      const nextTitles = state.timeline.channels.slice()
      nextTitles.splice(atC, 0, { title: '' })

      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          memory: nextMemory,
          channels: nextTitles
        })
      })
    }

    case 'CREATE_FRAME': {
      const L = state.timeline
      const memory = L.memory
      const atT = ev.frame

      const sizeReference = way.frame(memory, 0)
      const newFrame = way.fill(sizeReference, 0)
      const newMemory = way.insert(memory, atT, newFrame)

      const prevFrameConfig = L.frames[atT - 1]
      const prevTitle = prevFrameConfig ? prevFrameConfig.title : ''
      const newTitle = predictNextTitle(prevTitle)

      const newFrameConfigs = L.frames.slice()
      newFrameConfigs.splice(atT, 0, { title: newTitle })

      return Object.assign({}, state, {
        timeline: Object.assign({}, L, {
          memory: newMemory,
          frames: newFrameConfigs,
          select: L.select ? Object.assign({}, L.select, {
            frame: atT
          }) : null
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

    case 'SELECT_FRAME_TITLE': {
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          select: {
            channel: -1,
            frame: ev.frame
          }
        })
      })
    }

    case 'SELECT_CHANNEL_TITLE': {
      let newSelect

      const select = state.timeline.select

      if (select && select.channel === ev.channel && select.frame === -1) {
        // Deselect to toggle
        newSelect = null
      } else {
        newSelect = {
          channel: ev.channel,
          frame: -1
        }
      }

      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          select: newSelect
        })
      })
    }

    default: {
      return state
    }
  }
}
