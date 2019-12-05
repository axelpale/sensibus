const way = require('senseway')

module.exports = (model, ev) => {
  switch (ev.type) {
    case 'OPEN_CHANNEL_TITLE_EDITOR': {
      return Object.assign({}, model, {
        channelOnEdit: ev.channel
      })
    }

    default:
      return model
  }
}
