const redux = require('redux')
const reducer = require('./reduce')
const renderer = require('./render')
const hibernator = require('./hibernate')
const persistence = require('./persistence')

// Get state if stored in browser.
const initialState = persistence.getLocalState()

// Init store
const store = redux.createStore(reducer, initialState)
const dispatch = ev => store.dispatch(ev)

// Render
store.subscribe(() => {
  renderer.update(store, dispatch)
  persistence.queueSaveState(store, (err, msg) => {
    if (err) {
      console.error(err)
    } else {
      console.log('Timeline saved.', msg)
    }
  })
})

renderer.init(store, dispatch)

dispatch({ type: '__INIT__' })

// Fetch possibly updated state from server
persistence.getGlobalState((err, rawState) => {
  dispatch({
    type: 'SET_TIMELINE',
    channels: rawState.channels,
    frames: rawState.frames,
    memory: rawState.memory
  })
})
