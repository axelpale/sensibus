const defaultTimeline = require('./defaultTimeline')
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

      const select = state.timeline.select
      const nextSelect = select ? {
        channel: atC,
        frame: select.frame
      } : null

      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          memory: nextMemory,
          channels: nextTitles,
          select: nextSelect
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

    case 'REMOVE_CHANNEL': {
      const nextChannels = state.timeline.channels.slice()
      nextChannels.splice(ev.channel, 1)

      if (nextChannels.length === 0) {
        // Prevent deletion of the only channel.
        return state
      }

      const select = state.timeline.select
      const nextLast = nextChannels.length - 1
      const nextSelect = {
        channel: select.channel === ev.channel
          ? Math.min(select.channel, nextLast) // Prevent overflow
          : select.channel < ev.channel
            ? select.channel // The selected is before the deleted.
            : select.channel - 1,
        frame: 0
      }

      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          memory: way.dropChannel(state.timeline.memory, ev.channel),
          channels: nextChannels,
          select: nextSelect
        })
      })
    }

    case 'MOVE_CHANNEL': {
      const channelsCopy = state.timeline.channels.slice()
      const W = way.width(state.timeline.memory)
      const source = ev.channel
      const target = (W + ev.channel + ev.offset) % W

      const removedChannelConf = channelsCopy[source]
      channelsCopy.splice(source, 1)
      channelsCopy.splice(target, 0, removedChannelConf)

      const removedChannel = [state.timeline.memory[source]]
      const afterDrop = way.dropChannel(state.timeline.memory, source)
      const afterInsert = way.insertChannel(afterDrop, target, removedChannel)

      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          memory: afterInsert,
          channels: channelsCopy,
          select: {
            channel: target,
            frame: state.timeline.select.frame || 0
          }
        })
      })
    }

    case 'EDIT_CHANNEL_TITLE': {
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          channels: state.timeline.channels.map((chConf, c) => {
            if (c === ev.channel) {
              return Object.assign({}, chConf, {
                title: ev.title
              })
            }
            return chConf
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

    case 'SELECT_FRAME_TITLE': {
      let newSelect

      const select = state.timeline.select

      if (select && select.frame === ev.frame && select.channel === -1) {
        // Deselect
        newSelect = null
      } else {
        newSelect = {
          channel: -1,
          frame: ev.frame
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
