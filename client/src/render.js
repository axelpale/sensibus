require('./style.css')
const navbar = require('./navbar/render')
const storage = require('./storage/render')
const timeline = require('./timeline/render')
const cellEditor = require('./timeline/cellEditor/render')
const predictors = require('./predictors/render')
const performance = require('./performance/render')
const sidebarOpener = require('./navbar/sidebarOpener')
const createObserver = require('uilib').createObserver

const timelineChanged = createObserver([
  state => state.timeline,
  state => state.predictors.prediction
])
const sidebarChanged = createObserver([
  state => state.sidebar
])
const sidebarPageChanged = createObserver([
  state => state.sidebarPage
])
const performanceChanged = createObserver([
  state => state.performance
])

let sidebar
let sidebarContainer
let contentContainer

exports.init = (state, dispatch) => {
  const container = document.getElementById('container')

  // Root elem
  const root = document.createElement('div')
  root.classList.add('root')
  root.id = 'root'

  // Timeline
  root.appendChild(timeline.create(state, dispatch))

  // Sidebar
  sidebarContainer = document.createElement('div')
  sidebarContainer.classList.add('sidebar-container')
  sidebarContainer.id = 'sidebarContainer'
  root.appendChild(sidebarContainer)

  // Add to DOM
  container.appendChild(root)
}

exports.update = (state, dispatch) => {
  if (timelineChanged(state)) {
    timeline.update(state, dispatch)
  }

  if (sidebarChanged(state)) {
    if (state.sidebar) {
      sidebar = document.createElement('div')
      sidebar.classList.add('sidebar')
      sidebar.appendChild(navbar(state, dispatch))

      contentContainer = document.createElement('div')
      contentContainer.classList.add('sidebar-content')
      contentContainer.classList.add('container-fluid')

      sidebar.appendChild(contentContainer)
      sidebarContainer.appendChild(sidebar)
    } else {
      // Sidebar closed
      sidebarContainer.appendChild(sidebarOpener(state, dispatch))
    }
  }

  if (state.sidebar && sidebarPageChanged(state)) {
    // Clear content container
    if (contentContainer.firstChild) {
      contentContainer.removeChild(contentContainer.firstChild)
    }

    // Render navbar
    sidebar.replaceChild(navbar(state, dispatch), sidebar.firstChild)

    switch (state.sidebarPage) {
      case 'inspect':
        contentContainer.appendChild(predictors(state, dispatch))
        break

      case 'edit':
        if (state.timeline.select) {
          contentContainer.appendChild(cellEditor(state, dispatch))
        } else {
          contentContainer.innerHTML = 'Select a cell to edit it.'
        }
        break

      case 'performance':
        contentContainer.appendChild(performance(state, dispatch))
        break

      case 'storage':
        contentContainer.appendChild(storage(state, dispatch))
        break

      default:
        break
    }
  }

  const isPerfPage = state.sidebarPage === 'performance'
  if (state.sidebar && isPerfPage && performanceChanged(state)) {
    performance(state, dispatch)
  }
}
