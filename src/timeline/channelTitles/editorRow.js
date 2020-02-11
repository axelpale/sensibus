const template = require('./editorRow.ejs')

const listen = (el, query, eventName, handler) => {
  el.querySelector(query).addEventListener(eventName, handler)
}

module.exports = (state, dispatch) => {
  const editorRow = document.createElement('div')
  editorRow.classList.add('channel-editor-row')

  // Assert select not null
  const c = state.timeline.select.channel

  const numChannels = state.timeline.channels.length
  if (c < 2) {
    editorRow.style.left = '10rem'
  } else if (c < numChannels - 2) {
    editorRow.style.left = (6 + c * 4.2) + 'rem'
  } else {
    editorRow.style.left = (numChannels * 4.2 - 2) + 'rem'
  }

  editorRow.innerHTML = template({
    chan: c,
    channelTitle: state.timeline.channels[c].title
  })

  // Events

  listen(editorRow, '#channelForm', 'submit', ev => {
    ev.preventDefault()
    dispatch({
      type: 'EDIT_CHANNEL_TITLE',
      channel: c,
      title: editorRow.querySelector('#channelTitle').value
    })
  })

  listen(editorRow, '#channelTitle', 'input', ev => {
    dispatch({
      type: 'EDIT_CHANNEL_TITLE',
      channel: c,
      title: editorRow.querySelector('#channelTitle').value
    })
  })

  listen(editorRow, '#channelRemove', 'click', ev => {
    ev.preventDefault()
    dispatch({
      type: 'REMOVE_CHANNEL',
      channel: c
    })
  })

  listen(editorRow, '#channelMoveLeft', 'click', ev => {
    ev.preventDefault()
    dispatch({
      type: 'MOVE_CHANNEL',
      channel: c,
      offset: -1
    })
  })

  listen(editorRow, '#channelMoveRight', 'click', ev => {
    ev.preventDefault()
    dispatch({
      type: 'MOVE_CHANNEL',
      channel: c,
      offset: 1
    })
  })

  listen(editorRow, '#channelCreateLeft', 'click', ev => {
    ev.preventDefault()
    dispatch({
      type: 'CREATE_CHANNEL',
      belowChannel: c
    })
  })

  listen(editorRow, '#channelCreateRight', 'click', ev => {
    ev.preventDefault()
    dispatch({
      type: 'CREATE_CHANNEL',
      belowChannel: c + 1
    })
  })

  return editorRow
}
