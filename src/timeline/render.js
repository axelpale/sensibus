require('./style.css')
const way = require('senseway')
const memoryViewer = require('./memoryViewer/render')
const channelTitles = require('./channelTitles/render')

let observed = []
const changed = (vals) => {
  const allSame = vals.every((v, i) => v === observed[i])
  observed = vals
  return !allSame
}

const convertRemToPx = (r) => {
  const root = document.documentElement
  return r * parseFloat(window.getComputedStyle(root).fontSize)
}

const renderCanvas = (state, dispatch) => {
  const canvas = document.createElement('div')
  canvas.classList.add('timeline-canvas')

  const W = way.width(state.timeline.memory)
  const viewportWidthPx = document.documentElement.clientWidth
  const channelWidthPx = convertRemToPx(4.8)
  const sidebarWidthPx = Math.min(viewportWidthPx * 0.9, convertRemToPx(30))
  const canvasWidthPx = W * channelWidthPx + sidebarWidthPx
  canvas.style.width = '' + (canvasWidthPx).toFixed(2) + 'px'

  canvas.appendChild(channelTitles(state, dispatch))
  canvas.appendChild(memoryViewer(state, dispatch))

  return canvas
}

exports.init = (state, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('timeline-root')
  root.id = 'timeline-root'

  return root
}

exports.update = (state, dispatch) => {
  if (changed([state.timeline, state.predictors.prediction])) {
    const root = document.getElementById('timeline-root')
    // Note root scroll location
    // const x = root.scrollX
    // const y = root.scrollY
    // Append new canvas
    const canvas = renderCanvas(state, dispatch)
    // Remove old canvas if not empty.
    if (root.firstChild) {
      root.appendChild(canvas)
      root.removeChild(root.firstChild)
    } else {
      root.appendChild(canvas)
    }
    // LOGIC HACK; if-clause's expression
    // The if-clause looks like the root.appendChild(canvas) could be
    // moved before if for code simplicity. However, appending affects
    // the if-clause and therefore the code must be duplicated.
  }
}
