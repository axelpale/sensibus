const redux = require('redux')
const reducer = require('./reduce')
const renderer = require('./render')
const hibernator = require('./hibernate')

// Hibernate to localStorage
const storageName = 'sensibus-state'
const storedState = window.localStorage.getItem(storageName)
let initialState
if (storedState) {
  initialState = JSON.parse(storedState)
} else {
  initialState = {}
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
  const state = store.getState()
  renderer.update(state, dispatch)
  hibernate(hibernator(state))
})

renderer.init(store.getState(), dispatch)

dispatch({ type: '__INIT__' })
