const way = require('senseway')

module.exports = (state) => {
  let timeline = state.timeline

  // Init hideBefore
  if (typeof timeline.hideBefore === 'undefined') {
    const memLen = way.len(timeline.memory)
    const hideBefore = memLen - Math.min(25, memLen)
    timeline = Object.assign({}, timeline, {
      hideBefore: hideBefore
    })
  }

  // Init cellEditDirection and cellEditPredicted
  const dir = timeline.cellEditDirection
  if (typeof dir === 'undefined' || dir === 0) {
    timeline = Object.assign({}, timeline, {
      cellEditDirection: 1
    })
  }
  const pred = timeline.cellEditPredicted
  if (typeof pred === 'undefined' || pred === 0) {
    timeline = Object.assign({}, timeline, {
      cellEditPredicted: 1
    })
  }

  return Object.assign({}, state, {
    timeline: timeline
  })
}
