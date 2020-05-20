const navbarTemplate = require('./navbar.ejs')
const closeIconUrl = require('./xwhite.png').default

console.log(closeIconUrl)

const listenId = (root, elemId, handler) => {
  const el = root.querySelector('#' + elemId)
  el.addEventListener('click', handler)
}

exports.create = (store, dispatch) => {
  const sidebarPage = store.getState().sidebarPage

  const root = document.createElement('div')
  root.innerHTML = navbarTemplate({
    sidebarPage: sidebarPage,
    closeIconUrl: closeIconUrl
  })

  listenId(root, 'navbar-brand', ev => {
    ev.preventDefault()
    dispatch({
      type: 'CLOSE_SIDEBAR'
    })
  })

  listenId(root, 'navbarView', ev => {
    ev.preventDefault()
    dispatch({
      type: 'OPEN_PAGE',
      page: 'view'
    })
  })
  listenId(root, 'navbarInspect', ev => {
    ev.preventDefault()
    dispatch({
      type: 'OPEN_PAGE',
      page: 'inspect'
    })
  })
  listenId(root, 'navbarPerformance', ev => {
    ev.preventDefault()
    dispatch({
      type: 'OPEN_PAGE',
      page: 'performance'
    })
  })
  listenId(root, 'navbarStorage', ev => {
    ev.preventDefault()
    dispatch({
      type: 'OPEN_PAGE',
      page: 'storage'
    })
  })

  return root
}

exports.updateTab = (store, dispatch) => {
  const prevTab = document.querySelector('.sidebar .nav-item.active')
  prevTab.classList.remove('active')

  const sidebarPage = store.getState().sidebarPage
  const nextTab = document.querySelector('.nav-item.page-' + sidebarPage)
  nextTab.classList.add('active')
}
