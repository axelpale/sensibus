const reduxish = require('reduxish')

const renderers = [
  require('./render')
]

const reducers = [
  require('./reduce')
]

reduxish({
  storageName: 'sensibus-state',
  rootElementId: 'container',
  renderers: renderers,
  reducers: reducers
})
