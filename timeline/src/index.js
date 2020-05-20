const redux = require('redux')
const reducer = require('./reduce')
const renderer = require('./render')
const hibernator = require('./hibernate')
const migrate = require('./migrate')

// Get timeline id
const timelineId = window.sensibus.timelineId

// Hydrate from localStorage
const storageName = 'sensibus-state'
const storedState = window.localStorage.getItem(storageName)
let initialState
if (storedState) {
  const readState = JSON.parse(storedState)
  initialState = migrate(readState)
} else {
  initialState = null
}

const hibernate = (state) => {
  const stateJson = JSON.stringify(state)
  window.localStorage.setItem(storageName, stateJson)
}

// Init store
const store = redux.createStore(reducer, initialState)
const dispatch = ev => store.dispatch(ev)

// Render
store.subscribe(() => {
  renderer.update(store, dispatch)
  const state = store.getState()
  hibernate(hibernator(state))
})

renderer.init(store, dispatch)

dispatch({ type: '__INIT__' })
