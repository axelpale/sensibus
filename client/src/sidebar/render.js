const template = require('./template.ejs')
require('./sidebar.css')

const listenId = (root, elemId, handler) => {
  const el = root.querySelector('#' + elemId)
  el.addEventListener('click', handler)
}

module.exports = (state, dispatch) => {
  const root = document.createElement('div')
  root.innerHTML = template({
    sidebarPage: state.sidebarPage
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
