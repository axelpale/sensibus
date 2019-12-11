const download = require('./download')
const template = require('./template.ejs')
require('./custom.css')

const listenId = (elemId, evName, handler) => {
  const el = document.getElementById(elemId)
  el.addEventListener(evName, handler)
}

module.exports = (state, dispatch) => {
  const root = document.getElementById('nav-container')
  root.innerHTML = template({})

  listenId('file-new', 'click', ev => {
    dispatch({
      type: 'RESET_STATE'
    })
  })

  listenId('file-save', 'click', ev => {
    // Click to download
    const ex = state
    download('sensibus-backup.json', JSON.stringify(ex, null, 2))
  })

  const openInput = document.getElementById('file-open')
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

  listenId('edit-addchannel', 'click', ev => {
    dispatch({
      type: 'CREATE_CHANNEL'
    })
  })

  listenId('edit-addframe', 'click', ev => {
    dispatch({
      type: 'CREATE_FRAME'
    })
  })
}
