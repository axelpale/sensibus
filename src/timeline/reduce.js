const defaultTimeline = require('./defaultTimeline')
const channelEditor = require('./channelEditor/reduce')
const memoryViewer = require('./memoryViewer/reduce')
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
      const memory = state.timeline.memory
      const atT = ev.frame ? ev.frame : way.len(memory)

      const sizeReference = way.frame(memory, 0)
      const newFrame = way.fill(sizeReference, 0)
      const nextMemory = way.insert(memory, atT, newFrame)

      const nextTitles = state.timeline.frames.slice()
      nextTitles.splice(atT, 0, { title: '' })

      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          memory: nextMemory,
          frames: nextTitles
        })
      })
    }

    case 'CREATE_BREAK': {
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          breaks: [].concat(state.timeline.breaks, [ev.beforeFrame])
        })
      })
    }

    case 'REMOVE_BREAK': {
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          breaks: state.timeline.breaks.filter(t => {
            return t !== ev.frame && t !== ev.frame + 1
          })
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
