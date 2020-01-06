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
    dispatch({
      type: 'CLOSE_SIDEBAR'
    })
  })

  listenId(root, 'navbarInspect', ev => {
    dispatch({
      type: 'OPEN_PAGE',
      page: 'inspect'
    })
  })
  listenId(root, 'navbarEdit', ev => {
    dispatch({
      type: 'OPEN_PAGE',
      page: 'edit'
    })
  })
  listenId(root, 'navbarPerformance', ev => {
    dispatch({
      type: 'OPEN_PAGE',
      page: 'performance'
    })
  })
  listenId(root, 'navbarStorage', ev => {
    dispatch({
      type: 'OPEN_PAGE',
      page: 'storage'
    })
  })

  return root
}
