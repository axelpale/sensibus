const reduxish = require('reduxish')

const renderers = [
  require('./storage/render'),
  require('./timeline/render'),
  require('./predictors/render'),
  require('./performance/render')
]

const reducers = [
  require('./timeline/reduce'),
  require('./storage/reduce'),
  require('./predictors/reduce'),
  require('./performance/reduce')
]

reduxish({
  storageName: 'sensibus-state',
  rootElementId: 'content',
  renderers: renderers,
  reducers: reducers
})
