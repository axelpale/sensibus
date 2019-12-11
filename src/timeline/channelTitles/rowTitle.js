module.exports = (state, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('timeline-row-title')

  const fram = document.createElement('div')
  fram.classList.add('create-frame')
  fram.innerHTML = 'Abc&middot;&middot;'
  root.appendChild(fram)

  const chan = document.createElement('div')
  chan.classList.add('create-channel')
  chan.innerHTML = 'Abc<br>:'
  root.appendChild(chan)

  chan.addEventListener('click', ev => {
    dispatch({
      type: 'CREATE_CHANNEL'
    })
  })

  fram.addEventListener('click', ev => {
    dispatch({
      type: 'CREATE_FRAME'
    })
  })

  return root
}
