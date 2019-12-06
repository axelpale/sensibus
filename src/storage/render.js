const download = require('./download')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  const row = document.createElement('div')
  row.classList.add('row')
  row.classList.add('row-input')

  const createBtn = document.createElement('input')
  createBtn.type = 'button'
  createBtn.value = 'Create new'
  row.appendChild(createBtn)

  const exportBtn = document.createElement('input')
  exportBtn.type = 'button'
  exportBtn.value = 'Export file'
  row.appendChild(exportBtn)

  const importBtn = document.createElement('input')
  importBtn.type = 'file'
  row.appendChild(importBtn)

  root.appendChild(row)

  // Events

  createBtn.addEventListener('click', ev => {
    dispatch({
      type: 'RESET_STATE'
    })
  })

  exportBtn.addEventListener('click', ev => {
    // Click to download
    const ex = state
    download('sensibus-backup.json', JSON.stringify(ex, null, 2))
  })

  importBtn.addEventListener('change', ev => {
    const selectedFile = importBtn.files[0]
    var reader = new window.FileReader()
    reader.onload = (evt) => {
      const parsedState = JSON.parse(evt.target.result)
      dispatch({
        type: 'IMPORT_STATE',
        state: parsedState
      })
    }
    reader.readAsText(selectedFile, 'UTF-8')
  }, false)

  return root
}
