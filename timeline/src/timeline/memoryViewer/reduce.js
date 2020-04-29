const way = require('senseway')

const UP = 1
const DOWN = -1

const updateSelect = (state, channel, frame) => {
  // Determine cell edit direction from prediction at select
  // to prevent hysteria between predictions of edits.
  let pred
  if (state.predictors.prediction) {
    pred = state.predictors.prediction[channel][frame]
  } else {
    pred = 0
  }
  return Object.assign({}, state, {
    timeline: Object.assign({}, state.timeline, {
      select: {
        channel: channel,
        frame: frame
      },
      cellEditDirection: (pred > 0) ? UP : DOWN
    })
  })
}

module.exports = (state, ev) => {
  const timeline = state.timeline

  switch (ev.type) {
    case 'SELECT_CELL': {
      return updateSelect(state, ev.channel, ev.frame)
    }

    case 'SELECT_FRAME': {
      const sel = state.timeline.select
      const c = sel ? sel.channel : 0
      const t = ev.frame
      return updateSelect(state, c, t)
    }

    case 'SELECT_CHANNEL': {
      const sel = state.timeline.select
      const c = ev.channel
      const t = sel ? sel.frame : 0
      return updateSelect(state, c, t)
    }

    case 'SELECT_NONE': {
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          select: null
        })
      })
    }

    case 'EDIT_CELL': {
      const curval = timeline.memory[ev.channel][ev.frame]
      const nextval = (() => {
        // Take prediction into account.
        const dir = timeline.cellEditDirection
        if (dir && dir === UP) {
          if (curval === 0) return 1
          if (curval === 1) return -1
          if (curval === -1) return 0
        } else {
          if (curval === 0) return -1
          if (curval === -1) return 1
          if (curval === 1) return 0
        }
        return curval
      })()

      return Object.assign({}, state, {
        timeline: Object.assign({}, timeline, {
          memory: way.set(timeline.memory, ev.channel, ev.frame, nextval)
        })
      })
    }

    case 'EDIT_FRAME_TITLE': {
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
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
          select: {
            channel: state.timeline.select.channel || 0,
            frame: target
          }
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
          select: null
        })
      })
    }

    default:
      return state
  }
}
