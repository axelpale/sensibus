module.exports = {
  version: 1,
  meta: {
    channels: {
      'a': { title: 'Channel A' },
      'b': { title: 'Channel B' }
    },
    frames: [
      { title: 'Frame 1' },
      { title: 'Frame 2' }
    ]
  },
  frames: [
    ['a'],
    ['b']
  ],
  edit: {
    channel: null,
    frame: null
  },
  selection: null
}
