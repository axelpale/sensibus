require('./style.css')
const way = require('senseway')
const wayViewer = require('./wayViewer/render')
const channelEditor = require('./channelEditor/render')
const channelTitles = require('./channelTitles/render')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('timeline-root')

  const canvas = document.createElement('div')
  canvas.classList.add('timeline-canvas')

  const W = way.width(state.timeline.memory)
  canvas.style.width = '' + (W * 4.8 + 38).toFixed(2) + 'rem'

  canvas.appendChild(channelEditor(state, dispatch))
  canvas.appendChild(channelTitles(state, dispatch))
  canvas.appendChild(wayViewer(state, dispatch))

  root.appendChild(canvas)

  return root
}
