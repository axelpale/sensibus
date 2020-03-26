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

const memoryChanged = createObserver([
  state => state.timeline.memory
])

const predictionChanged = createObserver([
  state => state.predictors.prediction
])

const selectChanged = createObserver([
  state => state.timeline.select
])

const frameTitlesChanged = createObserver([
  state => state.timeline.frames
])

let root
let canvasEl
let memoryEl

exports.create = (store, dispatch) => {
  const state = store.getState()

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

exports.update = (store, dispatch) => {
  const state = store.getState()

  if (channelTitlesChanged(state)) {
    channelTitles.update(state, dispatch)
  }

  if (memoryWidthChanged(state)) {
    // Set fixed width because canvas contains inline-elements.
    const W = way.width(state.timeline.memory)
    canvasEl.style.width = '' + (10.1 + W * 4.8).toFixed(2) + 'rem'
  }

  const memoryCh = memoryChanged(state)
  const predictionCh = predictionChanged(state)
  const selectCh = selectChanged(state)
  const frameTitlesCh = frameTitlesChanged(state)

  if (memoryCh || predictionCh) {
    // Update everything
    const newMemoryEl = memoryViewer.create(store, dispatch)
    canvasEl.replaceChild(newMemoryEl, memoryEl)
    memoryEl = newMemoryEl
  } else {
    if (frameTitlesCh) {
      memoryViewer.updateFrameTitles(store, dispatch)
    }
    if (selectCh) {
      memoryViewer.updateSelect(store, dispatch)
    }
  }
}
