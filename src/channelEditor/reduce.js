const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'EDIT_CHANNEL_TITLE': {
      return Object.assign({}, model, {
        channelOnEdit: null,
        channels: model.channels.map((chConf, c) => {
          if (c === ev.channel) {
            return Object.assign({}, chConf, {
              title: ev.title
            });
          }
          return chConf;
        })
      });
    }

    case 'REMOVE_CHANNEL': {
      const copy = model.channels.slice()
      copy.splice(ev.channel, 1)

      return Object.assign({}, model, {
        timeline: way.dropChannel(model.timeline, ev.channel),
        channels: copy,
        channelOnEdit: null,
        select: {
          channel: model.select.channel >= ev.channel ?
            model.select.channel - 1 :
            model.select.channel,
          time: 0
        }
      })
    }

    case 'MOVE_CHANNEL': {
      const channelsCopy = model.channels.slice()
      const W = way.width(model.timeline)
      const source = ev.channel
      const target = (W + ev.channel + ev.offset) % W

      const removedChannelConf = channelsCopy[source]
      channelsCopy.splice(source, 1)
      channelsCopy.splice(target, 0, removedChannelConf)

      const removedChannel = model.timeline[source]
      const afterDrop = way.dropChannel(model.timeline, source)
      const afterInsert = way.insertChannel(afterDrop, target, removedChannel)

      return Object.assign({}, model, {
        timeline: afterInsert,
        channels: channelsCopy,
        channelOnEdit: target
      })
    }

    default:
      return model;
  }
};
