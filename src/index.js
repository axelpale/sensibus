const redux = require('redux')
const reducer = require('./reduce')
const renderer = require('./render')
const clearElem = require('./lib/clearElem')

// Hydrate to localStorage
const storageName = 'sensibus-state'
const storedState = window.localStorage.getItem(storageName)
let initialState
if (storedState) {
  initialState = JSON.parse(storedState)
} else {
  initialState = {}
}

const hydrate = (state) => {
  const stateJson = JSON.stringify(state)
  window.localStorage.setItem(storageName, stateJson)
}

// Init store
const store = redux.createStore(reducer, initialState)
const dispatch = ev => store.dispatch(ev)

// Render
const rootElementId = 'container'
store.subscribe(() => {
  const state = store.getState()

  const container = document.getElementById(rootElementId)
  clearElem(container)

  const maybeElem = renderer(state, dispatch)
  if (maybeElem) {
    container.appendChild(maybeElem)
  }

  hydrate({
    sidebar: state.sidebar,
    timeline: state.timeline
  })
})

dispatch({ type: '__INIT__' })
