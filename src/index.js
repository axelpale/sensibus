const reduxish = require('reduxish')

const renderers = [
  require('./storage/render'),
  require('./timeline/render')
  // require('./predictors/render'),
  // require('./performance/render')
]

const reducers = [
  require('./storage/reduce'),
  require('./timeline/reduce')
  // require('./predictors/reduce'),
  // require('./performance/reduce')
]

reduxish({
  defaultModel: {},
  storageName: 'sensibus-state',
  rootElementId: 'content',
  renderers: renderers,
  reducers: reducers
})
