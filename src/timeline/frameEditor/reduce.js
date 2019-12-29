const way = require('senseway')

module.exports = (state, ev) => {
  switch (ev.type) {
    case 'EDIT_FRAME_TITLE': {
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          frameOnEdit: null,
          frames: state.timeline.frames.map((frameConf, t) => {
            if (t === ev.frame) {
              return Object.assign({}, frameConf, {
                title: ev.title
              })
            } // else
            return frameConf
          })
        })
      })
    }

    case 'MOVE_FRAME': {
      const LEN = way.len(state.timeline.memory)
      const source = ev.frame
      const target = (LEN + ev.frame + ev.offset) % LEN
      const copy = state.timeline.frames.slice()

      const frameConf = copy[source]
      copy.splice(source, 1)
      copy.splice(target, 0, frameConf)

      const frame = way.frame(state.timeline.memory, source)
      const afterDrop = way.dropFrame(state.timeline.memory, source)
      const afterInsert = way.insert(afterDrop, target, frame)

      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          memory: afterInsert,
          frames: copy,
          frameOnEdit: target
        })
      })
    }

    case 'REMOVE_FRAME': {
      const copy = state.timeline.frames.slice()
      copy.splice(ev.frame, 1)

      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          memory: way.dropFrame(state.timeline.memory, ev.frame),
          frames: copy,
          frameOnEdit: null,
          select: null
        })
      })
    }

    default:
      return state
  }
}
