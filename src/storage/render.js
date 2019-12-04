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
      type: 'RESET_TIMELINE'
    })
  })

  exportBtn.addEventListener('click', ev => {
    // Click to download
    const ex = {
      timeline: state.timeline
    }
    download('timeline.json', JSON.stringify(ex, null, 2))
  })

  importBtn.addEventListener('change', ev => {
    const selectedFile = importBtn.files[0]
    var reader = new FileReader()
    reader.onload = (evt) => {
      const parsedTimeline = JSON.parse(evt.target.result)
      dispatch({
        type: 'IMPORT_TIMELINE',
        timeline: parsedTimeline
      })
    }
    reader.readAsText(selectedFile, 'UTF-8')
  }, false)

  return root
}
