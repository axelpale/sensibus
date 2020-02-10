require('./style.css')
const navbar = require('./navbar/render')
const storage = require('./storage/render')
const timeline = require('./timeline/render')
const cellEditor = require('./timeline/cellEditor/render')
const frameEditor = require('./timeline/frameEditor/render')
const predictors = require('./predictors/render')
const performance = require('./performance/render')
const sidebarOpener = require('./navbar/sidebarOpener')

exports.init = (state, dispatch) => {
  const container = document.getElementById('container')

  // Root elem
  const root = document.createElement('div')
  root.classList.add('root')
  root.id = 'root'

  // Timeline
  root.appendChild(timeline.init(state, dispatch))

  // Sidebar
  const sidebarContainer = document.createElement('div')
  sidebarContainer.classList.add('sidebar-container')
  sidebarContainer.id = 'sidebarContainer'
  root.appendChild(sidebarContainer)

  // Add to DOM
  container.appendChild(root)
}

exports.update = (state, dispatch) => {
  timeline.update(state, dispatch)

  // Clear sidebar container
  const sidebarContainer = document.getElementById('sidebarContainer')
  if (sidebarContainer.firstChild) {
    sidebarContainer.removeChild(sidebarContainer.firstChild)
  }

  if (state.sidebar) {
    const sidebar = document.createElement('div')
    sidebar.classList.add('sidebar')
    sidebar.appendChild(navbar(state, dispatch))

    const container = document.createElement('div')
    container.classList.add('sidebar-content')
    container.classList.add('container-fluid')

    switch (state.sidebarPage) {
      case 'inspect':
        container.appendChild(predictors(state, dispatch))
        break

      case 'edit':
        if (state.timeline.select) {
          container.appendChild(cellEditor(state, dispatch))
          container.appendChild(frameEditor(state, dispatch))
        } else {
          container.innerHTML = 'Select a cell to edit it.'
        }
        break

      case 'performance':
        container.appendChild(performance(state, dispatch))
        break

      case 'storage':
        container.appendChild(storage(state, dispatch))
        break

      default:
        break
    }

    sidebar.appendChild(container)

    sidebarContainer.appendChild(sidebar)
  } else {
    // Sidebar closed
    sidebarContainer.appendChild(sidebarOpener(state, dispatch))
  }
}
