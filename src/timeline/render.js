require('./style.css')
const way = require('senseway')
const memoryViewer = require('./memoryViewer/render')
const channelTitles = require('./channelTitles/render')

exports.init = (state, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('timeline-root')
  root.id = 'timeline-root'

  return root
}

exports.update = (state, dispatch) => {
  // Remove old canvas
  const root = document.getElementById('timeline-root')
  if (root.firstChild) {
    root.removeChild(root.firstChild)
  }

  // New canvas
  const canvas = document.createElement('div')
  canvas.classList.add('timeline-canvas')

  const W = way.width(state.timeline.memory)
  canvas.style.width = '' + (W * 4.8 + 38).toFixed(2) + 'rem'

  canvas.appendChild(channelTitles(state, dispatch))
  canvas.appendChild(memoryViewer(state, dispatch))

  root.appendChild(canvas)
}
