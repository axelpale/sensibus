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
      cellEditPredicted: (pred > 0) ? UP : DOWN,
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
      const curVal = timeline.memory[ev.channel][ev.frame]
      // Take prediction into account.
      const dir = timeline.cellEditDirection

      let nextDir
      let nextVal
      // Towards unknown if not unknown already.
      if (curVal > 0) {
        nextVal = 0
        nextDir = -1
      } else if (curVal < 0) {
        nextVal = 0
        nextDir = 1
      } else {
        // nextVal either -1 or 1
        // Prediction determines cycle order
        nextVal = dir
      }

      return Object.assign({}, state, {
        timeline: Object.assign({}, timeline, {
          memory: way.set(timeline.memory, ev.channel, ev.frame, nextVal),
          cellEditDirection: nextDir
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
