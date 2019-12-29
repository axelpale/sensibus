
module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  if (state.timeline.select === null) {
    return root
  }

  const c = state.timeline.select.channel
  const title = state.timeline.channels[c].title

  root.classList.add('row')
  const col = document.createElement('div')
  col.classList.add('col-md')

  const hel = document.createElement('h2')
  hel.innerHTML = 'Channel'
  col.appendChild(hel)

  const form = document.createElement('form')

  const text = document.createElement('input')
  text.type = 'text'
  text.value = title
  form.appendChild(text)

  const okBtn = document.createElement('button')
  okBtn.type = 'button'
  okBtn.innerHTML = 'OK'
  form.appendChild(okBtn)

  const newline = document.createElement('div')

  const delBtn = document.createElement('button')
  delBtn.type = 'button'
  delBtn.innerHTML = 'DEL'
  newline.appendChild(delBtn)

  const leftBtn = document.createElement('button')
  leftBtn.type = 'button'
  leftBtn.innerHTML = 'Move left'
  newline.appendChild(leftBtn)

  const rightBtn = document.createElement('button')
  rightBtn.type = 'button'
  rightBtn.innerHTML = 'Move right'
  newline.appendChild(rightBtn)

  form.appendChild(newline)

  col.appendChild(form)
  root.appendChild(col)

  // Events

  form.addEventListener('submit', ev => {
    ev.preventDefault()
    dispatch({
      type: 'EDIT_CHANNEL_TITLE',
      channel: c,
      title: text.value
    })
  })

  okBtn.addEventListener('click', ev => {
    dispatch({
      type: 'EDIT_CHANNEL_TITLE',
      channel: c,
      title: text.value
    })
  })

  delBtn.addEventListener('click', ev => {
    dispatch({
      type: 'REMOVE_CHANNEL',
      channel: c
    })
  })

  leftBtn.addEventListener('click', ev => {
    dispatch({
      type: 'MOVE_CHANNEL',
      channel: c,
      offset: -1
    })
  })

  rightBtn.addEventListener('click', ev => {
    dispatch({
      type: 'MOVE_CHANNEL',
      channel: c,
      offset: 1
    })
  })

  return root
}
