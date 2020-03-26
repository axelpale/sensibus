const way = require('senseway')

module.exports = (timeline) => {
  // Init hideBefore
  if (typeof timeline.hideBefore === 'undefined') {
    const memLen = way.len(timeline.memory)
    const hideBefore = memLen - Math.min(25, memLen)
    timeline.hideBefore = hideBefore
  }

  return timeline
}
