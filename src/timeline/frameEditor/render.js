const template = require('./template.ejs')

const listen = (el, query, eventName, handler) => {
  el.querySelector(query).addEventListener(eventName, handler)
}

module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  if (state.timeline.select === null) {
    return root
  }

  const timeline = state.timeline
  const t = timeline.select.frame

  root.innerHTML = template({
    frameTitle: state.timeline.frames[t].title
  })

  // Events

  listen(root, '#frameForm', 'submit', ev => {
    ev.preventDefault()
    dispatch({
      type: 'EDIT_FRAME_TITLE',
      frame: t,
      title: root.querySelector('#frameTitle').value
    })
  })

  listen(root, '#frameRemove', 'click', ev => {
    dispatch({
      type: 'REMOVE_FRAME',
      frame: t
    })
  })

  listen(root, '#frameMoveUp', 'click', ev => {
    dispatch({
      type: 'MOVE_FRAME',
      frame: t,
      offset: 1
    })
  })

  listen(root, '#frameMoveDown', 'click', ev => {
    dispatch({
      type: 'MOVE_FRAME',
      frame: t,
      offset: -1
    })
  })

  listen(root, '#frameCreateUp', 'click', ev => {
    dispatch({
      type: 'CREATE_FRAME',
      frame: t + 1
    })
  })

  listen(root, '#frameCreateDown', 'click', ev => {
    dispatch({
      type: 'CREATE_FRAME',
      frame: t
    })
  })

  listen(root, '#frameCreateBreak', 'click', ev => {
    dispatch({
      type: 'CREATE_BREAK',
      beforeFrame: t
    })
  })

  listen(root, '#frameRemoveBreak', 'click', ev => {
    dispatch({
      type: 'REMOVE_BREAK',
      frame: t
    })
  })

  return root
}
