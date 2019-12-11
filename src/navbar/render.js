const download = require('./download')
const template = require('./template.ejs')
require('./custom.css')

module.exports = (state, dispatch) => {
  const root = document.getElementById('nav-container')
  root.innerHTML = template({})

  const createBtn = document.getElementById('file-new')
  createBtn.addEventListener('click', ev => {
    dispatch({
      type: 'RESET_STATE'
    })
  })

  const saveBtn = document.getElementById('file-save')
  saveBtn.addEventListener('click', ev => {
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
}
