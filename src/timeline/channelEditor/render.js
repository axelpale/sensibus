const template = require('./template.ejs')

const listen = (el, query, eventName, handler) => {
  el.querySelector(query).addEventListener(eventName, handler)
}

module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  if (state.timeline.select === null) {
    return root
  }

  const c = state.timeline.select.channel

  root.innerHTML = template({
    channelTitle: state.timeline.channels[c].title
  })

  // Events

  listen(root, '#channelForm', 'submit', ev => {
    ev.preventDefault()
    dispatch({
      type: 'EDIT_CHANNEL_TITLE',
      channel: c,
      title: root.querySelector('#channelTitle').value
    })
  })

  listen(root, '#channelRemove', 'click', ev => {
    ev.preventDefault()
    dispatch({
      type: 'REMOVE_CHANNEL',
      channel: c
    })
  })

  listen(root, '#channelMoveLeft', 'click', ev => {
    ev.preventDefault()
    dispatch({
      type: 'MOVE_CHANNEL',
      channel: c,
      offset: -1
    })
  })

  listen(root, '#channelMoveRight', 'click', ev => {
    ev.preventDefault()
    dispatch({
      type: 'MOVE_CHANNEL',
      channel: c,
      offset: 1
    })
  })

  listen(root, '#channelCreateLeft', 'click', ev => {
    ev.preventDefault()
    dispatch({
      type: 'CREATE_CHANNEL',
      belowChannel: c
    })
  })

  listen(root, '#channelCreateRight', 'click', ev => {
    ev.preventDefault()
    dispatch({
      type: 'CREATE_CHANNEL',
      belowChannel: c + 1
    })
  })

  return root
}
