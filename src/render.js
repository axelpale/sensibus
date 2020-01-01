require('./style.css')
const navbar = require('./navbar/render')
const timeline = require('./timeline/render')
const cellEditor = require('./timeline/cellEditor/render')
const channelEditor = require('./timeline/channelEditor/render')
const frameEditor = require('./timeline/frameEditor/render')
const predictors = require('./predictors/render')
const performance = require('./performance/render')

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
    container.classList.add('container-fluid')
    container.appendChild(cellEditor(state, dispatch))
    container.appendChild(channelEditor(state, dispatch))
    container.appendChild(frameEditor(state, dispatch))
    container.appendChild(predictors(state, dispatch))
    container.appendChild(performance(state, dispatch))
    sidebar.appendChild(container)

    sidebarContainer.appendChild(sidebar)
  } else {
    // Sidebar closed
    const opener = document.createElement('div')
    opener.classList.add('sidebar-opener')
    opener.classList.add('bg-dark')
    const openerIcon = document.createElement('img')
    openerIcon.src = 'img/icon.png'
    openerIcon.width = 30
    openerIcon.height = 30
    opener.appendChild(openerIcon)
    sidebarContainer.appendChild(opener)

    opener.addEventListener('click', ev => {
      dispatch({
        type: 'OPEN_SIDEBAR'
      })
    })
  }
}
