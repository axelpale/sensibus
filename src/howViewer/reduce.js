const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'HOW_EDIT_SELECTED': {
      return Object.assign({}, model, {
        select: {
          channel: ev.channel,
          time: ev.time
        }
      })
    }

    case 'HOW_ONOFF': {
      return Object.assign({}, model, {
        how: !model.how
      })
    }

    default:
      return model
  }
};
