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

  return Object.assign({}, state, {
    timeline: timeline
  })
}
