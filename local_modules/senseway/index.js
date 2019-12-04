// Senseway, a multi-channel timeline.
//

exports.add = (wayA, wayB) => {
  // a plus b
  return wayA.map((ch, c) => ch.map((q, t) => q + wayB[c][t]))
}

exports.after = (way, t, len) => {
  if (typeof len === 'undefined') { len = way[0].length - t }
  return exports.slice(way, t, t + len)
}

exports.average = (ways) => {
  // Average way in the given array of ways.
  if (ways.length === 0) {
    return []
  }
  const initAcc = exports.fill(ways[0], 0)
  const waySum = ways.reduce((acc, w) => exports.add(acc, w), initAcc)
  return exports.scale(waySum, 1 / ways.length)
}

exports.before = (way, t, len) => {
  // Pick %len frames immediately before t, exclude frame t.
  //
  if (typeof len === 'undefined') { len = Math.max(0, t) }
  return exports.slice(way, t - len, t)
}

exports.channel = (way, c) => {
  // Pick one channel for a way.
  return [way[c]]
}

exports.channels = (way, cs) => {
  // Pick multiple channels
  return cs.map(c => way[c])
}

exports.clone = (way) => {
  return way.map((ch) => {
    return ch.slice()
  })
}

exports.create = (width, len, fill) => {
  if (typeof fill !== 'number') {
    throw new Error('Fill must be number')
  }

  const channels = [];
  let i, j, ch;
  for (i = 0; i < width; i += 1) {
    ch = [];
    for (j = 0; j < len; j += 1) {
      ch.push(fill)
    }
    channels.push(ch)
  }
  return channels
};

exports.dropAt = (way, t) => {
  // Remove frame at t
  const w = exports.clone(way)
  w.map((ch) => {
    return ch.splice(t, 1)
  })
  return w
}
exports.drop = exports.dropAt
exports.dropFrame = exports.dropAt

exports.dropChannel = (way, channel) => {
  return way.filter((ch, c) => c !== channel)
}

exports.each = (way, iteratee) => {
  way.forEach((ch, c) => ch.forEach((q, t) => iteratee(q, c, t)))
}

exports.equal = (wayA, wayB) => {
  let i, j, ch
  for (i = 0; i < wayA.length; i += 1) {
    for (j = 0; j < wayA[0].length; j += 1) {
      if (wayA[i][j] !== wayB[i][j]) {
        return false
      }
    }
  }
  return true
}

exports.fill = (way, filler) => {
  // Same size, quanta replaced with filler.
  return way.map(ch => ch.map(q => filler))
}

exports.find = (way, iteratee) => {
  for (let c = 0; c < way.length; c += 1) {
    for (let t = 0; t < way[0].length; t += 1) {
      if (iteratee(way[c][t], c, t, way)) {
        return {
          value: way[c][t],
          channel: c,
          time: t
        }
      }
    }
  }
}

exports.first = (way, n) => {
  // First n frames; the oldest
  return way.map(ch => ch.slice(0, n))
}

exports.frame = (way, t) => {
  return way.map(ch => [ch[t]]) // frame is an array of arrays
}

exports.html = (way, opts) => {
  const rev = opts.reversed ? true : false
  const heading = opts.heading ? opts.heading : ''
  const caption = opts.caption ? opts.caption : ''
  const selected = opts.selected ? opts.selected : exports.fill(way, 0)

  const len = exports.len(way)
  const width = exports.width(way)

  let tbegin = 0
  let tend = len
  let dt = 1
  if (rev) {
    tbegin = len - 1
    tend = -1
    dt = -1
  }

  let str = '<div class="way" style="width:' + width + 'em">'
  str += '<div class="way-heading" '
  str += 'style="width:' + width + 'em;" '
  str += '>' + heading + '</div>'

  for (let t = tbegin; (rev ? t > tend : t < tend); t += dt) {
    str += '<div class="way-frame" style="display:flex">'
    for (let c = 0; c < width; c += 1) {
      const q = way[c][t]
      str += '<div '

      let classStr = 'way-cell'
      if (selected[c][t] === 1) classStr += ' way-selected'
      str += 'class="' + classStr + '" '

      const title = q + ' @[' + c + '][' + t + ']'
      str += 'title="' + title + '" '
      str += 'data-channel="' + c + '" '
      str += 'data-time="' + t + '" '

      let style = 'flex:1;width:1em;height:1em;'

      if (typeof q === 'number') {
        const h = '0' // degrees
        const s = '0%' // saturation
        const l = Math.round((1 - q) * 100) + '%' // lightness
        style += 'background-color: hsl(' + h + ',' + s + ',' + l + ')";'
      }

      str += 'style="' + style + '" '

      str += '>'
      str += '</div>'
    }
    str += '</div>'
  }

  str += '<div class="way-caption" '
  str += 'style="width:' + width + 'em;" '
  str += '>' + caption + '</div>'
  str += '</div>'
  return str
}

exports.increase = (way, addition) => {
  return way.map(ch => ch.map(quantum => quantum + addition))
}

exports.insert = (wayA, t, wayB) => {
  // Insert frames of wayB at t. Length of the way increases.
  return wayA.map((ch, c) => {
    return ch.slice(0, t).concat(wayB[c], ch.slice(t))
  })
}

exports.insertChannel = (way, c, channel) => {
  if (way.length > 0 && way[0].length !== channel.length) {
    throw new Error('Channel lengths must match.')
  }

  const copy = way.slice()
  copy.splice(c, 0, channel)
  return copy
}

exports.join = (wayA, wayB) => {
  // Add in series: constant number of channels, increased length
  if (wayA.length !== wayB.length) {
    throw new Error('Number of channels must match.')
  }
  return wayA.map((ch, c) => [].concat(ch, wayB[c]))
}

exports.last = (way, n) => {
  // Last n frames; the most recent
  return way.map(ch => ch.slice(ch.length - n, ch.length))
}

exports.len = (way) => {
  return way[0].length
}

exports.map = (way, fn) => {
  return way.map((ch, c) => ch.map((q, t) => fn(q, c, t)))
}

exports.map2 = (wayA, wayB, fn) => {
  return wayA.map((ch, c) => ch.map((q, t) => fn(q, wayB[c][t], c, t)))
}

exports.max = (way) => {
  // Largest value in the way. Returns scalar.
  return way.reduce((acc, ch) => {
    return ch.reduce((ac, q) => {
      return q > ac ? q : ac
    }, acc)
  }, way[0][0])
}

exports.mean = (way) => {
  // Returns a frame.
  return way.map((ch) => {
    return [ch.reduce((acc, q) => acc + q, 0) / ch.length]
  })
}

exports.min = (way) => {
  // Smallest value in the way.
  return way.reduce((acc, ch) => {
    return ch.reduce((ac, q) => {
      return q < ac ? q : ac
    }, acc)
  }, way[0][0])
}

exports.mix = (wayA, wayB) => {
  // Combine parallel. Length does not change, number of channels does.
  if (wayA[0].length !== wayB[0].length) {
    throw new Error('Length of channels must match.')
  }
  return [].concat(wayA, wayB)
}

exports.multiply = (wayA, wayB) => {
  return wayA.map((ch, c) => ch.map((q, t) => q * wayB[c][t]))
}

exports.negate = (way) => {
  return way.map(ch => ch.map(q => 1 - q))
}

exports.normalize = (way) => {
  // Scale values within 0..1
  const minq = exports.min(way)
  const maxq = exports.max(way)
  if (minq === maxq) {
    if (minq === 0) {
      // All zeros
      return way
    }
    if (minq < 0) {
      return exports.map(way, q => 0)
    }
    return exports.map(way, q => 1)
  }
  return exports.map(way, q => (q - minq) / (maxq - minq))
}

exports.padLeft = (way, len, filler) => {
  if (way[0].length >= len) {
    return way
  }
  const head = exports.create(way.length, len - way[0].length, filler)
  return exports.join(head, way)
}

exports.padRight = (way, len, filler) => {
  if (way[0].length >= len) {
    return way
  }
  const tail = exports.create(way.length, len - way[0].length, filler)
  return exports.join(way, tail)
}

exports.reduce = (way, iteratee, acc) => {
  return way.reduce((ac, ch, c) => {
    return ch.reduce((a, q, t) => {
      return iteratee(a, q, c, t)
    }, ac)
  }, acc)
}

exports.repeatAt = (way, t) => {
  // Repeat frame at
  const w = exports.clone(way)
  w.map(ch => {
    const val = ch[t]
    return ch.splice(t, 0, val)
  })
  return w
}

exports.repeatChannel = (way, c) => {
  const w = way.slice()
  w.splice(c, 0, way[c])
  return w
}

exports.scale = (way, multiplier) => {
  return way.map(ch => ch.map(quantum => quantum * multiplier))
}

exports.set = (way, c, t, value) => {
  // Set value of a cell
  const w = exports.clone(way)
  w[c][t] = value
  return w
}

exports.slice = (way, begin, end) => {
  // Get a part of the way.
  //
  // Fill frames outside of way with zeros:
  //
  //   Example t=-1, e=1:
  //                          [w0] [w1] [w2]
  //                     [ 0] [ 0]
  //                     [ 0] [w0]
  //   -----------------b---------e---------------------
  //         -3   -2   -1    0    1    2    3    4
  //
  //   Example b=2, e=4:
  //                          [w0] [w1] [w2]
  //                                    [ 0] [ 0]
  //                                    [w2] [ 0]
  //   --------------------------------b---------e------
  //         -3   -2   -1    0    1    2    3    4
  //
  //   Example b=-1, e=4:
  //                          [w0] [w1] [w2]
  //                     [ 0] [ 0] [ 0] [ 0] [ 0]
  //                     [ 0] [w0] [w1] [w2] [ 0]
  //   -----------------b------------------------e------
  //         -3   -2   -1    0    1    2    3    4
  //                    |
  //                 t - len
  //
  const len = end - begin
  const width = exports.width(way)
  const wayLen = way[0].length

  const filler = 0
  const leftPadLen = Math.min(len, Math.max(0, -begin))
  const leftPad = exports.create(width, leftPadLen, filler)
  const rightPadLen = Math.min(len, Math.max(0, end - wayLen))
  const rightPad = exports.create(width,rightPadLen, filler)

  const a = Math.min(wayLen, Math.max(0, begin))
  const b = Math.min(wayLen, Math.max(0, end))
  const wayPart = way.map(ch => ch.slice(a, b))

  const leftPadded = exports.join(leftPad, wayPart)
  return exports.join(leftPadded, rightPad)
}

exports.sum = (way) => {
  // Sum quanta together.
  return way.reduce((acc, ch) => ch.reduce((ac, q) => ac + q, acc), 0)
}

exports.toArray = (way) => {
  return way.reduce((acc, ch, c) => ch.reduce((ac, q, t) => {
    ac.push({
      channel: c,
      time: t,
      value: q
    })
    return ac
  }, acc), [])
}

exports.trim = (way, trimmee) => {
  // Remove leading and trailing frames whose cells only contain the trimmee.
  // For example way.trim(w, 1) trims:
  //   [[1, 0, 1],   to   [[0],
  //    [1, 1, 1]]         [1]]
  //
  trimmee = typeof trimmee === 'undefined' ? 0 : trimmee

  let begin = 0
  let end = 0

  const len = way[0].length
  for (let t = 0; t < len; t += 1) {
    if (way.some(ch => ch[t] !== trimmee)) {
      begin = t
      break
    }
  }

  for (let t = begin; t < len; t += 1) {
    if (way.some(ch => ch[t] !== trimmee)) {
      end = t + 1
    }
  }

  return way.map(ch => ch.slice(begin, end))
}

exports.width = (way) => {
  return way.length
}
