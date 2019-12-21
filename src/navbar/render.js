const download = require('./download')
const template = require('./template.ejs')
require('./custom.css')

const listenId = (root, elemId, handler) => {
  const el = root.querySelector('#' + elemId)
  el.addEventListener('click', handler)
}

module.exports = (state, dispatch) => {
  const root = document.createElement('div')
  root.innerHTML = template({})

  listenId(root, 'navbar-brand', ev => {
    dispatch({
      type: 'CLOSE_SIDEBAR'
    })
  })

  listenId(root, 'file-new', ev => {
    dispatch({
      type: 'RESET_STATE'
    })
  })

  listenId(root, 'file-save', ev => {
    // Click to download
    const ex = state
    download('sensibus-backup.json', JSON.stringify(ex, null, 2))
  })

  const openInput = root.querySelector('#file-open')
  openInput.addEventListener('change', ev => {
    const selectedFile = openInput.files[0]
    const reader = new window.FileReader()
    reader.onload = (evt) => {
      const parsedState = JSON.parse(evt.target.result)
      dispatch({
        type: 'IMPORT_STATE',
        state: parsedState
      })
    }
    reader.readAsText(selectedFile, 'UTF-8')
  }, false)

  listenId(root, 'edit-addchannel', ev => {
    dispatch({
      type: 'CREATE_CHANNEL'
    })
  })

  listenId(root, 'edit-addframe', ev => {
    dispatch({
      type: 'CREATE_FRAME'
    })
  })

  listenId(root, 'edit-selectnone', ev => {
    dispatch({
      type: 'SELECT_NONE'
    })
  })

  return root
}
