// Senseway, a multi-channel timeline.
//

exports.abs = (way) => {
  // Return a way where every element is mapped to its absolute value.
  return way.map(ch => ch.map(Math.abs))
}

exports.add = (wayA, wayB) => {
  // Element-wise a plus b
  return wayA.map((ch, c) => ch.map((q, t) => q + wayB[c][t]))
}

exports.after = (way, t, len) => {
  // Pick %len frames after t and include frame t.
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

  const channels = []
  let i, j, ch
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
  // Call %iteratee for every quantum
  way.forEach((ch, c) => ch.forEach((q, t) => iteratee(q, c, t)))
}

exports.equal = (wayA, wayB) => {
  // Test if ways are deeply equal in value.
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
  // Return first quantum that satisfies predicate %iteratee.
  // Return undefined if not found.
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
  // First %n frames; the oldest
  return way.map(ch => ch.slice(0, n))
}

exports.frame = (way, t) => {
  // Return a way with single frame
  return way.map(ch => [ch[t]]) // frame is an array of arrays
}

exports.get = (way, c, t) => {
  const w = exports.width(way)
  const l = exports.len(way)
  if (0 <= c && c < w && 0 <= t && t < l) {
    return way[c][t]
  }
  return 0
}

exports.html = (way, opts) => {
  const rev = opts.reversed ? true : false
  const heading = opts.heading ? opts.heading : ''
  const caption = opts.caption ? opts.caption : ''
  const selected = opts.selected ? opts.selected : exports.fill(way, 0)
  const normalize = opts.normalize ? true : false
  const title = opts.title ? opts.title : (q, c, t) => {
    return q + ' @[' + c + '][' + t + ']'
  }

  const len = exports.len(way)
  const width = exports.width(way)

  // Normalize colors
  const colorWay = normalize ? exports.normalize(way) : way

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
    str += '<div class="way-frame" style="height:1em">'
    for (let c = 0; c < width; c += 1) {
      const q = way[c][t]
      str += '<div '

      let classStr = 'way-cell'
      if (selected[c][t] === 1) classStr += ' way-selected'
      str += 'class="' + classStr + '" '

      str += 'title="' + title(q, c, t) + '" '
      str += 'data-channel="' + c + '" '
      str += 'data-time="' + t + '" '

      let style = 'display:inline-block;width:1em;height:1em;'

      if (typeof q === 'number') {
        const colorq = colorWay[c][t]
        const h = colorq < 0 ? '180' : '0' // degrees
        // Saturation
        const s = '100%'
        // Lightness
        const l = Math.round(50 + (1 - Math.abs(colorq)) * 50) + '%'
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
  if (way.length > 0 && way[0].length !== channel[0].length) {
    throw new Error('Channel lengths must match.')
  }

  const copy = way.slice()
  copy.splice(c, 0, channel[0])
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
  if (way.length > 0) {
    return way[0].length
  }
  return 0
}

exports.map = (way, fn) => {
  // Element-wise map.
  return way.map((ch, c) => ch.map((q, t) => fn(q, c, t)))
}

exports.map2 = (wayA, wayB, fn) => {
  // Combine two ways to one by calling fn for each element pair.
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
  // Channel means. Returns a single-frame way.
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
  return way.map(ch => ch.map(q => -q))
}

exports.normalize = (way) => {
  // Scale values within -1..1
  const maxq = Math.max(-exports.min(way), exports.max(way))
  return exports.map(way, q => q / maxq)
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
  // Reduce elements to a value.
  return way.reduce((ac, ch, c) => {
    return ch.reduce((a, q, t) => {
      return iteratee(a, q, c, t)
    }, ac)
  }, acc)
}

exports.remap = (way, min, max) => {
  // Scale values so that smallest becomes %min and largest becomes %max.
  const minq = exports.min(way)
  const maxq = exports.max(way)
  if (minq === maxq) {
    return exports.map(way, q => min)
  }
  // First to 0..1
  const unit = exports.map(way, q => (q - minq) / (maxq - minq))
  // Then to min..max
  return exports.map(unit, q => (q * (max - min) + min))
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

exports.size = (way) => {
  // Number of elements; width x length.
  //
  const w = way.length
  if (w === 0) {
    return 0
  }
  const l = way[0].length
  return w * l
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
  const wayLen = exports.len(way)

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

exports.sliceAround = (way, sliceLen, time) => {
  const begin = time - Math.max(0, Math.floor(sliceLen / 2))
  const end = begin + sliceLen
  return exports.slice(way, begin, end)
}

exports.slices = (way, sliceLen, timeOffset) => {
  // TODO optimize to avoid calling slice
  return way[0].map((q, t) => {
    return exports.slice(way, t + timeOffset, t + timeOffset + sliceLen)
  })
}

exports.slicesByList = (way, sliceTimes) => {
  const len = exports.len(way)
  const okTimes = sliceTimes.filter(t => t < len)
  const ts = [0].concat(okTimes, [len])
  const slices = []
  for (let i = 0; i < ts.length - 1; i += 1) {
    const begin = ts[i]
    const end = ts[i + 1]
    slices.push(exports.slice(way, begin, end))
  }
  return slices
}

exports.sum = (way) => {
  // Sum elements together.
  return way.reduce((acc, ch) => ch.reduce((ac, q) => ac + q, acc), 0)
}

exports.sumAbs = (way) => {
  // Sum absolute values of elements together.
  return way.reduce((ac, ch) => ch.reduce((a, q) => a + Math.abs(q), ac), 0)
}

exports.sums = (way) => {
  // Sum elements together per channel. Return way.
  return way.map(ch => [ch.reduce((ac, q) => ac + q, 0)])
}

exports.sumsAbs = (way) => {
  // Sum absolute values of elements in together per channel. Return way.
  return way.map(ch => [ch.reduce((ac, q) => ac + Math.abs(q), 0)])
}

exports.sumsPos = (way) => {
  // Sum positive values of elements in together per channel. Return way.
  return way.map(ch => [ch.reduce((ac, q) => ac + (q < 0 ? 0 : q), 0)])
}

exports.toArray = (way) => {
  // Return an array of element objects.
  return way.reduce((acc, ch, c) => ch.reduce((ac, q, t) => {
    ac.push({
      channel: c,
      time: t,
      value: q
    })
    return ac
  }, acc), [])
}

exports.toTimeOrderedArray = (way) => {
  // Return an array of element objects.
  const arr = []
  const len = way[0] ? way[0].length : 0 // allow empty way
  const wid = way.length
  let c, t
  for (t = 0; t < len; t += 1) {
    for (c = 0; c < wid; c += 1) {
      arr.push({
        channel: c,
        time: t,
        value: way[c][t]
      })
    }
  }
  return arr
}

exports.trim = (way, trimmee) => {
  // Remove leading and trailing frames whose cells only contain the trimmee.
  // For example way.trim(w, 1) trims:
  //   [[1, 0, 1],   to   [[0],
  //    [1,-1, 1]]         [-1]]
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

exports.variance = (way) => {
  // Channel variance. Return a single-frame way.
  return way.map((ch) => {
    const l = ch.length
    const mean = ch.reduce((acc, q) => acc + q, 0) / l
    const va = ch.reduce((acc, q) => acc + (q - mean) * (q - mean), 0) / l
    return [va]
  })
}

exports.width = (way) => {
  return way.length
}
