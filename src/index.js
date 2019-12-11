const reduxish = require('reduxish')

const renderers = [
  require('./navbar/render'),
  require('./timeline/render'),
  require('./predictors/render'),
  require('./performance/render')
]

const reducers = [
  require('./timeline/reduce'),
  require('./navbar/reduce'),
  require('./predictors/reduce'),
  require('./performance/reduce')
]

reduxish({
  storageName: 'sensibus-state',
  rootElementId: 'container',
  renderers: renderers,
  reducers: reducers
})
