exports.create = (store, dispatch) => {
  // Sidebar is closed. Render opener.
  const opener = document.createElement('div')
  opener.classList.add('sidebar-opener')

  if (store.getState().sidebar === false) {
    opener.classList.add('d-none')
  }

  const openerIcon = document.createElement('span')
  openerIcon.innerHTML = 'Stats for Nerds'
  opener.appendChild(openerIcon)

  opener.addEventListener('click', ev => {
    dispatch({
      type: 'OPEN_SIDEBAR'
    })
  })

  return opener
}

exports.hide = (store, dispatch) => {
  const opener = document.querySelector('.sidebar-opener')
  opener.classList.add('d-none')
}

exports.show = (store, dispatch) => {
  const opener = document.querySelector('.sidebar-opener')
  opener.classList.remove('d-none')
}
