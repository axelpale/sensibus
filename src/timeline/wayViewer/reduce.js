const way = require('senseway')

module.exports = (state, ev) => {
  const timeline = state.timeline

  switch (ev.type) {
    case 'EDIT_CELL': {
      const sel = timeline.select

      const curval = timeline.way[ev.channel][ev.frame]
      const nextval = (() => {
        // If the cell is already selected, change the value
        if (sel && sel.channel === ev.channel && sel.frame === ev.frame) {
          // Todo take prediction into account
          if (curval === 1) return 0
          if (curval === 0) return -1
          if (curval === -1) return 1
        } // else
        return curval
      })()

      return Object.assign({}, state, {
        timeline: Object.assign({}, timeline, {
          way: way.set(timeline.way, ev.channel, ev.frame, nextval),
          select: {
            channel: ev.channel,
            frame: ev.frame
          }
        })
      })
    }

    case 'OPEN_FRAME_TITLE_EDITOR': {
      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          frameOnEdit: ev.frame,
          select: null
        })
      })
    }

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
      const LEN = way.len(state.timeline.way)
      const source = ev.frame
      const target = (LEN + ev.frame + ev.offset) % LEN
      const copy = state.timeline.frames.slice()

      const frameConf = copy[source]
      copy.splice(source, 1)
      copy.splice(target, 0, frameConf)

      const frame = way.frame(state.timeline.way, source)
      const afterDrop = way.dropFrame(state.timeline.way, source)
      const afterInsert = way.insert(afterDrop, target, frame)

      return Object.assign({}, state, {
        timeline: Object.assign({}, state.timeline, {
          way: afterInsert,
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
          way: way.dropFrame(state.timeline.way, ev.frame),
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
