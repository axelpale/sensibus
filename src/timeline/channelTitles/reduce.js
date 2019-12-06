module.exports = (state, ev) => {
  switch (ev.type) {
    case 'OPEN_CHANNEL_TITLE_EDITOR': {
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          channelOnEdit: ev.channel
        })
      })
    }

    default:
      return state
  }
}
