const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'OPEN_CHANNEL_TITLE_EDITOR': {
      return Object.assign({}, model, {
        channelOnEdit: ev.channel
      })
    }

    case 'CREATE_CHANNEL': {
      const sizeReference = way.channel(model.timeline, 0)
      const newChannel = way.fill(sizeReference, null)
      return Object.assign({}, model, {
        timeline: way.mix(newChannel, model.timeline),
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
      return model
  }
};
