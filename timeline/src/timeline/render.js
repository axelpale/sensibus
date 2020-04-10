require('./style.css')
const way = require('senseway')
const memoryViewer = require('./memoryViewer/render')
const channelTitles = require('./channelTitles/render')
const createObserver = require('uilib').createObserver

const channelTitlesChanged = createObserver([
  state => state.timeline.select,
  state => state.timeline.channels
])

const memoryWidthChanged = createObserver([
  state => way.width(state.timeline.memory)
])

const memoryViewerChanged = createObserver([
  state => state.timeline.select,
  state => state.timeline.memory,
  state => state.predictors.prediction
])

const frameTitlesChanged = createObserver([
  state => state.timeline.frames
])

let root
let canvasEl
let memoryEl

exports.create = (state, dispatch) => {
  root = document.createElement('div')
  root.classList.add('timeline-root')
  root.id = 'timeline-root'

  canvasEl = document.createElement('div')
  canvasEl.classList.add('timeline-canvas')
  canvasEl.id = 'timeline-canvas'

  canvasEl.appendChild(channelTitles.create(state, dispatch))

  // Prediction not yet available because reducers not ran.
  // Therefore render only dummy memory at this point.
  // TODO merge create-update in same way as done in reducers?
  memoryEl = document.createElement('div')
  canvasEl.appendChild(memoryEl)

  root.appendChild(canvasEl)

  root.addEventListener('click', ev => {
    if (ev.target === root) {
      dispatch({
        type: 'SELECT_NONE'
      })
    }
  })

  return root
}

exports.update = (state, dispatch) => {
  if (channelTitlesChanged(state)) {
    channelTitles.update(state, dispatch)
  }

  if (memoryWidthChanged(state)) {
    // Set fixed width because canvas contains inline-elements.
    const W = way.width(state.timeline.memory)
    canvasEl.style.width = '' + (10.1 + W * 4.8).toFixed(2) + 'rem'
  }

  if (memoryViewerChanged(state)) {
    const newMemoryEl = memoryViewer.create(state, dispatch)
    canvasEl.replaceChild(newMemoryEl, memoryEl)
    memoryEl = newMemoryEl
  } else {
    if (frameTitlesChanged(state)) {
      memoryViewer.updateFrameTitles(state, dispatch)
    }
  }
}
