const reduxish = require('reduxish');
const way = require('senseway');

const renderers = [
  require('./storage/render'),
  // require('./timeline/render'),
  // require('./predictors/render'),
  // require('./performance/render')
];

const reducers = [
  require('./storage/reduce'),
  // require('./timeline/reduce'),
  // require('./predictors/reduce'),
  // require('./performance/reduce')
];

const u = null;

reduxish({
  defaultModel: {
    timeline: [
      //                                   13.6.
      [u, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, u, u, u], // fiil
      [u, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, u, u, u], // ulko
      [u, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, u, u, u], // sarj
      [u, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, u, u, u], // kast
      [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, u, u, u], // kiip
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, u, u, u], // uimi
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, u, u, u], // koti
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, u, u, u], // friends
      [u, u, u, u, u, 1, 1, 0, 0, 1, 0, 0, 1, u, u, u] // musa
    ],
    frames: [
      { title: 'la 1.6.' },
      { title: 'su 2.6.' },
      { title: 'ma 3.6.' },
      { title: 'ti 4.6.' },
      { title: 'ke 5.6.' },
      { title: 'to 6.6.' },
      { title: 'pe 7.6.' },
      { title: 'la 8.6.' },
      { title: 'su 9.6.' },
      { title: 'ma 10.6.' },
      { title: 'ti 11.6.' },
      { title: 'ke 12.6.' },
      { title: 'to 13.6.' },
      { title: 'pe 14.6.' },
      { title: 'la 15.6.' },
      { title: 'su 16.6.' },
    ],
    channels: [ // Dimensions
      {
        title: 'Good feels',
        star: true
      },
      {
        title: 'Went outside'
      },
      {
        title: 'Watched movie'
      },
      {
        title: 'Watered plants'
      },
      {
        title: 'Climbed some&shy;whe&shy;re'
      },
      {
        title: 'Swam a bit'
      },
      {
        title: 'Stayed at home'
      },
      {
        title: 'Friends'
      },
      {
        title: 'Played music'
      }
    ],
    channelOnEdit: null,
    contextLength: 7,
    frameOnEdit: null,
    how: false,
    select: {
      channel: 0,
      time: 0
    },
    version: 0 // data model version
  },
  storageName: 'future-model',
  rootElementId: 'content',
  renderers: renderers,
  reducers: reducers
});
