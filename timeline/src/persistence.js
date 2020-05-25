const migrate = require('./migrate')
const hibernate = require('./hibernate')
const sensibusApi = require('sensibus-api-client')

// Get timeline id
const timelineId = window.sensibus.timelineId

// Possibly hydrate from localStorage
const STORAGE_KEY = 'sensibus-state'

exports.getLocalState = () => {
  const storedState = window.localStorage.getItem(STORAGE_KEY)

  if (storedState) {
    const readState = JSON.parse(storedState)
    return migrate(readState)
  }

  return null
}

exports.getGlobalState = (callback) => {
  sensibusApi.getTimeline(timelineId).then(timeline => {
    return callback(null, timeline)
  }).catch(err => {
    return callback(err)
  })
}

exports.saveState = (store, callback) => {
  // Save state immediately to local and global storage.
  // Callback is called after response from the global storage.
  const state = store.getState()

  // Save to local storage
  const dryState = hibernate(state)
  const dryStateJson = JSON.stringify(dryState)
  window.localStorage.setItem(storageName, dryStateJson)

  // Save to global storage
  sensibusApi.postTimelineEvent(timelineId, {
    channels: dryState.channels,
    frames: dryState.frames,
    memory: dryState.memory
  }).then(msg => {
    return callback(null, msg)
  }).catch(err => {
    return callback(err)
  })
}

let queueTimeout = null
let waitingResponse = false
exports.queueSaveState = (store, callback) => {
  // Calls after the first will be skipped until the first finishes.
  // However, the first reads the latest store state and therefore
  // include also the changes that caused the latter calls.
  if (!queueTimeout) {
    queueTimeout = setTimeout(() => {
      // Clear timeout to allow new state changes to be saved.
      queueTimeout = null

      // Backend might take more than our timeout time to respond.
      // If we are still waiting response to the previous saveState call,
      // then what should we do? In worst case the first call will eventually
      // reach the server and overwrite changes made by the latter calls.
      // TODO set request timeouts.

      waitingResponse = true
      exports.saveState(store, (err, payload) => {
        // TODO detect request timeout.
        waitingResponse = false
        return callback(err, payload)
      })
    }, 5000)
  }
}
