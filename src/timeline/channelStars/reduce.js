const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'STAR_CHANNEL': {
      const c = ev.channel
      const chs = model.channels.slice()
      chs[c] = Object.assign({}, chs[c], {
        star: !chs[c].star // flip
      })

      return Object.assign({}, model, {
        channels: chs
      })
    }

    default:
      return model
  }
};
