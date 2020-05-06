require('./style.css')
const header = require('./header/render')
const sidebar = require('./sidebar/render')
const timeline = require('./timeline/render')
const predictors = require('./predictors/render')
const createObserver = require('uilib').createObserver

// TODO move under timeline/render
const timelineChanged = createObserver([
  state => state.timeline,
  state => state.predictors.prediction
])

exports.init = (store, dispatch) => {
  const container = document.getElementById('container')

  // Root elem
  const root = document.createElement('div')
  root.classList.add('root')
  root.id = 'root'

  // Header
  root.appendChild(header.create(store, dispatch))

  // Timeline
  root.appendChild(timeline.create(store, dispatch))

  // Sidebar
  root.appendChild(sidebar.create(store, dispatch))

  // Add to DOM
  container.appendChild(root)
}

exports.update = (store, dispatch) => {
  const state = store.getState()

  header.update(store, dispatch)

  if (timelineChanged(state)) { // TODO move condition in timeline
    timeline.update(store, dispatch)
  }

  predictors.update(store, dispatch)

  sidebar.update(store, dispatch)
}
