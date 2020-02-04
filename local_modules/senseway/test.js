// Testing

const way = require('./index')
const test = require('tape')

const V = [
  [1, 0, 1],
  [0, 1, 0]
]
const W0 = [
  [1, 0, 1],
  [0, 1, 1]
]
const W1 = [
  [0, 0, 1],
  [1, 0, 0]
]
const ZEROS = [
  [0, 0, 0],
  [0, 0, 0]
]
const ONES = [
  [1, 1, 1],
  [1, 1, 1]
]
const TWOS = [
  [2, 2, 2],
  [2, 2, 2]
]
const SEQ = [
  [0, 1, 2],
  [3, 4, 5]
]
const UPDOWN = [
  [-1, 0, 1],
  [1, 0, -1]
]
const ONEOONE = [
  [1, 0, 1],
  [1, 0, 1]
]

test('abs', (t) => {
  t.deepEqual(way.abs(UPDOWN), ONEOONE)
  t.end()
})

test('add', (t) => {
  t.deepEqual(way.add(W0, W1), [
    [1, 0, 2],
    [1, 1, 1]
  ])
  t.end()
})

test('after', (t) => {
  t.deepEqual(way.after(V, 2), [
    [1],
    [0]
  ])
  t.deepEqual(way.after(V, 2, 2), [
    [1, 0],
    [0, 0]
  ])
  t.deepEqual(way.after(V, -3, 2), [
    [0, 0],
    [0, 0]
  ])
  t.deepEqual(way.after(V, -1, 4), [
    [0, 1, 0, 1],
    [0, 0, 1, 0]
  ])
  t.end()
})

test('average', (t) => {
  t.deepEqual(way.average([ZEROS, TWOS]), ONES)
  t.end()
})

test('before', (t) => {
  t.deepEqual(way.before(V, 2), [
    [1, 0],
    [0, 1]
  ])
  t.deepEqual(way.before(V, 0), [
    [],
    []
  ])
  t.deepEqual(way.before(V, 0, 2), [
    [0, 0],
    [0, 0]
  ])
  t.deepEqual(way.before(V, 4, 5), [
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0]
  ])
  t.end()
})

test('channel', (t) => {
  t.deepEqual(way.channel(W0, 1), [
    [0, 1, 1]
  ])
  t.end()
})

test('channels', (t) => {
  t.deepEqual(way.channels(W0, [0, 1]), [
    [1, 0, 1],
    [0, 1, 1]
  ])
  t.end()
})

test('clone', (t) => {
  t.deepEqual(way.clone(W0), W0)
  t.notEqual(way.clone(W0), W0)
  t.end()
})

test('create', (t) => {
  t.deepEqual(way.create(2, 3, 1), ONES)
  t.deepEqual(way.create(5, 0, 1), [[], [], [], [], []])
  t.end()
})

test('dropAt', (t) => {
  t.deepEqual(way.dropAt(V, 1), [
    [1, 1],
    [0, 0]
  ])
  t.end()
})

test('dropChannel', (t) => {
  t.deepEqual(way.dropChannel(V, 1), [
    [1, 0, 1]
  ])
  t.end()
})

test('each', (t) => {
  t.plan(6)

  let i = 0
  way.each(SEQ, (q, c, time) => {
    t.equal(q, i)
    i += 1
  })
})

test('equal', (t) => {
  t.true(way.equal(W0, W0))
  t.false(way.equal(W0, W1))
  t.end()
})

test('fill', (t) => {
  t.deepEqual(way.fill(ONES, 0), [
    [0, 0, 0],
    [0, 0, 0]
  ])
  t.end()
})

test('find', (t) => {
  t.deepEqual(way.find(SEQ, (q, c, t) => q === 4 - t + c), {
    value: 2,
    channel: 0,
    time: 2
  })
  t.end()
})

test('first', (t) => {
  t.deepEqual(way.first(W0, 2), [
    [1, 0],
    [0, 1]
  ])
  t.end()
})

test('frame', (t) => {
  t.deepEqual(way.frame(W0, 1), [
    [0],
    [1]
  ])
  t.end()
})

test('get', t => {
  t.equal(way.get(V, 1, 0), 0)
  t.equal(way.get(V, 1, 1), 1)
  t.equal(way.get(V, -2, -1), 0)
  t.equal(way.get(V, 495, 122122), 0)
  t.end()
})

test('increase', (t) => {
  t.deepEqual(way.increase(ONES, 1), [
    [2, 2, 2],
    [2, 2, 2]
  ])
  t.end()
})

test('insert', (t) => {
  t.deepEqual(way.insert(ONES, 1, TWOS), [
    [1, 2, 2, 2, 1, 1],
    [1, 2, 2, 2, 1, 1]
  ])
  t.deepEqual(way.insert(ONES, 5, TWOS), [
    [1, 1, 1, 2, 2, 2],
    [1, 1, 1, 2, 2, 2]
  ], 'over range ok')
  t.end()
})

test('insertChannel', (t) => {
  t.deepEqual(way.insertChannel(ONES, 1, [[2, 2, 2]]), [
    [1, 1, 1],
    [2, 2, 2],
    [1, 1, 1]
  ])
  t.deepEqual(way.insertChannel(ONES, 2, [[2, 2, 2]]), [
    [1, 1, 1],
    [1, 1, 1],
    [2, 2, 2]
  ])
  t.throws(() => {
    way.insertChannel(ONES, 2, [2, 2])
  }, /must match/)
  t.throws(() => {
    way.insertChannel(ONES, 2, [[2, 2]])
  }, /must match/)
  t.end()
})

test('join', (t) => {
  t.deepEqual(way.join(ZEROS, ONES), [
    [0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1, 1]
  ])
  t.end()
})

test('last', (t) => {
  t.deepEqual(way.last(W0, 2), [
    [0, 1],
    [1, 1]
  ])
  t.end()
})

test('len', (t) => {
  t.equal(way.len(W0), 3)
  t.end()
})

test('map', (t) => {
  t.deepEqual(way.map(ONES, q => q * 2), [
    [2, 2, 2],
    [2, 2, 2]
  ])
  t.deepEqual(way.map(ONES, (q, c, t) => t * (c + 1)), [
    [0, 1, 2],
    [0, 2, 4]
  ])
  t.end()
})

test('map2', (t) => {
  t.deepEqual(way.map2(ONES, TWOS, (qa, qb) => qa + qb), [
    [3, 3, 3],
    [3, 3, 3]
  ])
  t.end()
})

test('mask', t => {
  t.deepEqual(way.mask(TWOS, V), [
    [2, 0, 2],
    [0, 2, 0]
  ])
  t.deepEqual(way.mask([], []), [])
  t.end()
})

test('max', (t) => {
  t.equal(way.max(ONES), 1)
  t.equal(way.max(SEQ), 5)
  t.end()
})

test('mean', (t) => {
  t.deepEqual(way.mean(ONES), [
    [1],
    [1]
  ])
  t.deepEqual(way.mean(ZEROS), [
    [0],
    [0]
  ])
  t.end()
})

test('min', (t) => {
  t.equal(way.min(ONES), 1)
  t.equal(way.min(SEQ), 0)
  t.end()
})

test('mix', (t) => {
  t.deepEqual(way.mix(ZEROS, ONES), [
    [0, 0, 0],
    [0, 0, 0],
    [1, 1, 1],
    [1, 1, 1]
  ])
  t.end()
})

test('multiply', (t) => {
  t.deepEqual(way.multiply(ONES, ZEROS), ZEROS)
  t.end()
})

test('negate', (t) => {
  t.deepEqual(way.negate(V), [
    [-1, -0, -1],
    [-0, -1, -0]
  ])
  t.end()
})

test('normalize', (t) => {
  t.deepEqual(way.normalize([[-2, 0, 2]]), [[-1, 0, 1]])
  t.deepEqual(way.normalize([[2, 2, 2]]), [[1, 1, 1]])
  t.end()
})

test('padLeft', (t) => {
  t.deepEqual(way.padLeft(ONES, 5, 2), [
    [2, 2, 1, 1, 1],
    [2, 2, 1, 1, 1]
  ])
  t.deepEqual(way.padLeft(ONES, 2, 2), [
    [1, 1, 1],
    [1, 1, 1]
  ])
  t.end()
})

test('padRight', (t) => {
  t.deepEqual(way.padRight(ONES, 5, 2), [
    [1, 1, 1, 2, 2],
    [1, 1, 1, 2, 2]
  ])
  t.deepEqual(way.padRight(ONES, 2, 2), [
    [1, 1, 1],
    [1, 1, 1]
  ])
  t.end()
})

test('product', t => {
  t.equal(way.product(ONES), 1)
  t.equal(way.product(V), 0)
  t.equal(way.product(TWOS), 64)
  t.end()
})

test('reduce', (t) => {
  t.equal(way.reduce(ONES, (acc, q) => acc + q, 0), 6)
  t.end()
})

test('remap', (t) => {
  const w = [[-2, 4, 2]]
  t.deepEqual(way.remap(w, 0, 3), [[0, 3, 2]])
  t.deepEqual(way.remap(w, -1, 2), [[-1, 2, 1]])
  t.end()
})

test('repeatAt', (t) => {
  t.deepEqual(way.repeatAt(V, 1), [
    [1, 0, 0, 1],
    [0, 1, 1, 0]
  ])
  t.end()
})

test('repeatChannel', t => {
  t.deepEqual(way.repeatChannel(V, 0), [
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0]
  ])
  t.end()
})

test('scale', (t) => {
  t.deepEqual(way.scale(ONES, 2), [
    [2, 2, 2],
    [2, 2, 2]
  ])
  t.end()
})

test('set', (t) => {
  t.deepEqual(way.set(ONES, 0, 2, 0), [
    [1, 1, 0],
    [1, 1, 1]
  ])
  t.end()
})

test('size', (t) => {
  t.equal(way.size(ONES), 6)
  t.equal(way.size([]), 0)
  t.equal(way.size([[]]), 0)
  t.end()
})

test('slice', (t) => {
  t.deepEqual(way.slice(V, 1, 3), [
    [0, 1],
    [1, 0]
  ])
  t.deepEqual(way.slice(V, 1, 5), [
    [0, 1, 0, 0],
    [1, 0, 0, 0]
  ])
  t.deepEqual(way.slice(V, 0, 0), [
    [],
    []
  ])
  t.deepEqual(way.slice(V, -3, -1), [
    [0, 0],
    [0, 0]
  ])
  t.deepEqual(way.slice(V, -3, 1), [
    [0, 0, 0, 1],
    [0, 0, 0, 0]
  ])
  t.end()
})

test('slices', (t) => {
  t.deepEqual(way.slices(V, 2, 0), [
    [[1, 0], [0, 1]],
    [[0, 1], [1, 0]],
    [[1, 0], [0, 0]]
  ])
  t.deepEqual(way.slices(V, 1, -1), [
    [[0], [0]],
    [[1], [0]],
    [[0], [1]]
  ])
  t.end()
})

test('slicesByList', (t) => {
  t.deepEqual(way.slicesByList(V, [1, 2]), [
    [[1], [0]],
    [[0], [1]],
    [[1], [0]]
  ])
  t.deepEqual(way.slicesByList(V, []), [V])
  t.deepEqual(way.slicesByList([], [1, 2]), [[]])
  t.end()
})

test('sum', (t) => {
  t.equal(way.sum(ONES), 6)
  t.equal(way.sum(V), 3)
  t.equal(way.sum(ZEROS), 0)
  t.end()
})

test('sumAbs', (t) => {
  t.equal(way.sumAbs(UPDOWN), 4)
  t.end()
})

test('sums', (t) => {
  t.deepEqual(way.sums(ONES), [[3], [3]])
  t.deepEqual(way.sums(V), [[2], [1]])
  t.deepEqual(way.sums(UPDOWN), [[0], [0]])
  t.end()
})

test('sumsAbs', (t) => {
  t.deepEqual(way.sumsAbs(UPDOWN), [[2], [2]])
  t.end()
})

test('sumsPos', (t) => {
  t.deepEqual(way.sumsPos(UPDOWN), [[1], [1]])
  t.end()
})

test('toArray', (t) => {
  t.deepEqual(way.toArray([[1, 1],[0, 1]]), [
    {
      channel: 0,
      time: 0,
      value: 1
    },
    {
      channel: 0,
      time: 1,
      value: 1
    },
    {
      channel: 1,
      time: 0,
      value: 0
    },
    {
      channel: 1,
      time: 1,
      value: 1
    }
  ])
  t.deepEqual(way.toArray([]), [])
  t.end()
})

test('toTimeOrderedArray', (t) => {
  t.deepEqual(way.toTimeOrderedArray([[1, 1],[0, 1]]), [
    {
      channel: 0,
      time: 0,
      value: 1
    },
    {
      channel: 1,
      time: 0,
      value: 0
    },
    {
      channel: 0,
      time: 1,
      value: 1
    },
    {
      channel: 1,
      time: 1,
      value: 1
    }
  ])
  t.deepEqual(way.toTimeOrderedArray([]), [])
  t.end()
})

test('trim', (t) => {
  t.deepEqual(way.trim(ZEROS), [[], []])
  t.deepEqual(way.trim(W0, 1), [[1, 0], [0, 1]])
  t.end()
})

test('variance', (t) => {
  t.deepEqual(way.variance(ONES), [[0], [0]])
  t.deepEqual(way.variance(ZEROS), [[0], [0]])
  t.deepEqual(way.variance([
    [2, 0, 2, 0],
    [0, 1, 1, 0]
  ]), [[1], [0.25]])
  t.end()
})

test('width', (t) => {
  t.equal(way.width(ONES), 2)
  t.end()
})
