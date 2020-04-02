require('./sidebar.css')
const navbar = require('./navbar')
const sidebarOpener = require('./sidebarOpener')
const view = require('../view/render')
const predictors = require('../predictors/render')
const performance = require('../performance/render')

const sidebarChanged = createObserver([
  state => state.sidebar
])
const sidebarPageChanged = createObserver([
  state => state.sidebarPage
])
const performanceChanged = createObserver([
  state => state.performance
])

const openSidebar = (store, dispatch) => {
  const sidebar = document.querySelector('.sidebar')
  sidebar.classList.remove('active')
}

const closeSidebar = (store, dispatch) => {
  const sidebar = document.querySelector('.sidebar')
  sidebar.classList.add('d-none')
}

const createPage = (store, dispatch) => {
  // Returns pageEl for sidebarPage name.
  const sidebarPage = store.getState().sidebarPage
  switch (sidebarPage) {
    case 'inspect':
      return predictors.create(store, dispatch)

    case 'view':
      return view.create(store, dispatch)

    case 'performance':
      return performance.create(store, dispatch)

    case 'storage':
      return storage.create(store, dispatch)

    default:
      return null
  }
}

exports.create = (store, dispatch) => {
  const sidebarContainer = document.createElement('div')
  sidebarContainer.classList.add('sidebar-container')
  sidebarContainer.id = 'sidebarContainer'

  const sidebar = document.createElement('div')
  sidebar.classList.add('sidebar')
  sidebarContainer.appendChild(sidebar)

  const navbarEl = navbar.create(store, dispatch)
  sidebar.appendChild(navbarEl)

  const contentContainer = document.createElement('div')
  contentContainer.classList.add('sidebar-content')
  contentContainer.classList.add('container-fluid')
  sidebar.appendChild(contentContainer)

  sidebarContainer.appendChild(sidebarOpener.create(store, dispatch))
}

exports.update = (store, dispatch) => {
  const state = store.getState()
  const isSidebarChanged = sidebarChanged(state)
  const isSidebarPageChanged = sidebarPageChanged(state)
  const isTimelineChanged = timelineChanged(state)
  const isPerfChanged = performanceChanged(state)

  // Open/close sidebar and sidebar opener
  if (isSidebarChanged) {
    if (state.sidebar) {
      // Sidebar open
      sidebarOpener.hide(store, dispatch)
      openSidebar(store, dispatch)
    } else {
      // Sidebar closed
      sidebarOpener.show(state, dispatch)
      closeSidebar(store, dispatch)
    }
  }

  // Create pages when sidebar opens or page is changed.
  if (state.sidebar && (isSidebarPageChanged || isSidebarChanged)) {
    // Update navbar on page change and page open.
    navbar.updateTab(store, dispatch)

    // First, clear content container (cc)
    const cc = document.querySelector('.sidebar-content')
    if (cc.firstChild) {
      cc.removeChild(cc.firstChild)
    }

    // Then, render the page.
    cc.appendChild(createPage(store, dispatch))
  }

  // Update performance
  const isPerfPage = state.sidebarPage === 'performance'
  if (state.sidebar && isPerfPage && isPerfChanged) {
    performance.update(store, dispatch)
  }

}
