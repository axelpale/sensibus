const way = require('senseway')

module.exports = (state, ev) => {
  switch (ev.type) {
    case 'EDIT_CHANNEL_TITLE': {
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          channelOnEdit: null,
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

    case 'REMOVE_CHANNEL': {
      const copy = state.timeline.channels.slice()
      copy.splice(ev.channel, 1)

      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          memory: way.dropChannel(state.timeline.memory, ev.channel),
          channels: copy,
          channelOnEdit: null,
          select: {
            channel: state.timeline.select.channel >= ev.channel
              ? state.timeline.select.channel - 1
              : state.timeline.select.channel,
            frame: 0
          }
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

      const removedChannel = state.timeline.memory[source]
      const afterDrop = way.dropChannel(state.timeline.memory, source)
      const afterInsert = way.insertChannel(afterDrop, target, removedChannel)

      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          memory: afterInsert,
          channels: channelsCopy,
          channelOnEdit: target
        })
      })
    }

    default:
      return state
  }
}
