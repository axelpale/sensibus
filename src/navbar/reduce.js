module.exports = (state, ev) => {
  switch (ev.type) {
    case 'CLOSE_SIDEBAR': {
      return Object.assign({}, state, {
        sidebar: false
      })
    }

    case 'OPEN_SIDEBAR': {
      return Object.assign({}, state, {
        sidebar: true
      })
    }

    case 'OPEN_PAGE': {
      return Object.assign({}, state, {
        sidebar: true,
        sidebarPage: ev.page
      })
    }

    default:
      return state
  }
}
