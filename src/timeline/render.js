const channelEditor = require('./channelEditor/render')
const channelTitles = require('./channelTitles/render')
const wayViewer = require('./wayViewer/render')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('timeline-root')

  root.appendChild(channelEditor(state, dispatch))
  root.appendChild(channelTitles(state, dispatch))
  root.appendChild(wayViewer(state, dispatch))

  return root
}
