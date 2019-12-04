const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'CREATE_NEW_TIMELINE': {
      return Object.assign({}, model, {
        channels: [
          { title: 'Channel A' },
          { title: 'Channel B' }
        ],
        frames: [
          { title: 'Frame 1' },
          { title: 'Frame 2' },
        ],
        timeline: [
          [0, 1],
          [1, 0]
        ],
        channelOnEdit: null,
        frameOnEdit: null,
        select: {
          channel: 0,
          time: 0
        }
      });
    }

    case 'IMPORT_MODEL': {
      return Object.assign({}, model, {
        channels: ev.model.channels,
        frames: ev.model.frames,
        timeline: ev.model.timeline,
        channelOnEdit: null,
        frameOnEdit: null,
        select: {
          channel: 0,
          time: 0
        }
      });
    }

    default:
      return model;
  }
};
