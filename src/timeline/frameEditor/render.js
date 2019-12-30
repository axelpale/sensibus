
module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  if (state.timeline.select === null) {
    return root
  }

  const timeline = state.timeline
  const t = timeline.select.frame
  const frameTitle = timeline.frames[t].title

  root.classList.add('row')
  const col = document.createElement('div')
  col.classList.add('col-md')

  const hel = document.createElement('h2')
  hel.innerHTML = 'Frame'
  col.appendChild(hel)

  const form = document.createElement('form')

  const text = document.createElement('input')
  text.type = 'text'
  text.value = frameTitle
  form.appendChild(text)

  const okBtn = document.createElement('button')
  okBtn.type = 'button'
  okBtn.innerHTML = 'OK'
  form.appendChild(okBtn)

  const delBtn = document.createElement('button')
  delBtn.type = 'button'
  delBtn.innerHTML = 'DEL'
  form.appendChild(delBtn)

  const upBtn = document.createElement('button')
  upBtn.type = 'button'
  upBtn.innerHTML = 'Move up'
  form.appendChild(upBtn)

  const downBtn = document.createElement('button')
  downBtn.type = 'button'
  downBtn.innerHTML = 'Move down'
  form.appendChild(downBtn)

  const breakBtn = document.createElement('button')
  breakBtn.type = 'button'
  breakBtn.innerHTML = 'Break below'
  form.appendChild(breakBtn)

  const delBreakBtn = document.createElement('button')
  delBreakBtn.type = 'button'
  delBreakBtn.innerHTML = 'Remove Break'
  form.appendChild(delBreakBtn)

  col.appendChild(form)
  root.appendChild(col)

  // Events

  form.addEventListener('submit', ev => {
    ev.preventDefault()
    dispatch({
      type: 'EDIT_FRAME_TITLE',
      frame: t,
      title: text.value
    })
  })

  okBtn.addEventListener('click', ev => {
    dispatch({
      type: 'EDIT_FRAME_TITLE',
      frame: t,
      title: text.value
    })
  })

  delBtn.addEventListener('click', ev => {
    dispatch({
      type: 'REMOVE_FRAME',
      frame: t
    })
  })

  upBtn.addEventListener('click', ev => {
    dispatch({
      type: 'MOVE_FRAME',
      frame: t,
      offset: 1
    })
  })

  downBtn.addEventListener('click', ev => {
    dispatch({
      type: 'MOVE_FRAME',
      frame: t,
      offset: -1
    })
  })

  breakBtn.addEventListener('click', ev => {
    dispatch({
      type: 'CREATE_BREAK',
      beforeFrame: t
    })
  })

  delBreakBtn.addEventListener('click', ev => {
    dispatch({
      type: 'REMOVE_BREAK',
      frame: t
    })
  })

  return root
}
