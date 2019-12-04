const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'EDIT_CELL': {
      const sel = model.select

      const curval = model.timeline[ev.channel][ev.time];
      const nextval = (() => {
        if (sel.channel === ev.channel && sel.time === ev.time) {
          if (curval === null) return 1
          if (curval === 1) return 0
          if (curval === 0) return null
        } // else
        return curval
      })();

      return Object.assign({}, model, {
        timeline: way.set(model.timeline, ev.channel, ev.time, nextval),
        select: {
          channel: ev.channel,
          time: ev.time
        }
      });
    }

    case 'OPEN_FRAME_TITLE_EDITOR': {
      return Object.assign({}, model, {
        frameOnEdit: ev.time
      });
    }

    case 'EDIT_FRAME_TITLE': {
      return Object.assign({}, model, {
        frameOnEdit: null,
        frames: model.frames.map((frameConf, t) => {
          if (t === ev.time) {
            return Object.assign({}, frameConf, {
              title: ev.title
            });
          } // else
          return frameConf;
        })
      });
    }

    case 'MOVE_FRAME': {
      const LEN = way.len(model.timeline)
      const source = ev.time
      const target = (LEN + ev.time + ev.offset) % LEN
      const copy = model.frames.slice()

      const frameConf = copy[source]
      copy.splice(source, 1)
      copy.splice(target, 0, frameConf)

      const frame = way.frame(model.timeline, source)
      const afterDrop = way.dropFrame(model.timeline, source)
      const afterInsert = way.insert(afterDrop, target, frame)

      return Object.assign({}, model, {
        timeline: afterInsert,
        frames: copy,
        frameOnEdit: target
      })
    }

    case 'REMOVE_FRAME': {
      const copy = model.frames.slice()
      copy.splice(ev.time, 1)

      const sc = model.select.channel
      const st = model.select.time

      return Object.assign({}, model, {
        timeline: way.dropFrame(model.timeline, ev.time),
        frames: copy,
        frameOnEdit: null,
        select: {
          channel: sc,
          time: st >= ev.time ? st - 1 : st
        }
      })
    }

    default:
      return model;
  }
};
