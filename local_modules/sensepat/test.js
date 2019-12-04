// Testing

const pat = require('./index')
const test = require('tape')

const V = {
  value: [
    [1, 0, 1],
    [0, 1, 0]
  ],
  mass: [
    [1, 1, 1],
    [1, 1, 1]
  ]
}

const ONESHALF = {
  value: [
    [1, 1, 1],
    [1, 1, 1]
  ],
  mass: [
    [1, 1, 1],
    [0, 0, 0]
  ]
}

test('contextMean', (t) => {
  // Trivial
  const hist = {
    value: [[1]],
    mass: [[1]]
  }
  const patt = {
    value: [[1]],
    mass: [[1]]
  }
  const ctx = pat.contextMean(hist, patt)
  t.deepEqual(ctx, {
    value: [[1]],
    mass: [[1]]
  })

  // Simple. Two matches. One frame with no mass.
  const h2 = {
    value: [[1, 1, 0, 1]],
    mass: [[1, 1, 1, 0]]
  }
  const p2 = {
    value: [[1, 0]],
    mass: [[1, 0]]
  }
  const ctx2 = pat.contextMean(h2, p2)
  t.deepEqual(ctx2, {
    value: [[1, 0.5]],
    mass: [[2, 2]]
  })

  // Three matches, last on the edge.
  const h3 = {
    value: [[1, 1, 0, 1]],
    mass: [[1, 1, 1, 1]]
  }
  const p3 = {
    value: [[1, 0]],
    mass: [[1, 0]]
  }
  const ctx3 = pat.contextMean(h3, p3)
  t.deepEqual(ctx3, {
    value: [[1, 0.5]],
    mass: [[3, 2]]
  })

  t.end()
})

test('equalSize', (t) => {
  t.equal(pat.equalSize(V, ONESHALF), true)

  const VS = {
    value: [[1, 0], [0, 1]],
    mass: [[1, 1], [1, 1]]
  }
  t.equal(pat.equalSize(V, VS), false)
  t.end()
})

test('findMatches', (t) => {
  const history = {
    value: [[1, 1, 0, 1, 0]],
    mass: [[0, 1, 1, 1, 1]]
  }
  const pattern = {
    value: [[1, 1, 1]],
    mass: [[0, 1, 0]]
  }
  t.deepEqual(pat.findMatches(history, pattern), [
    {
      time: 0,
      value: [[1, 1, 0]],
      mass: [[0, 1, 1]]
    },
    {
      time: 2,
      value: [[0, 1, 0]],
      mass: [[1, 1, 1]]
    }
  ])
  t.end()
})

test('infoGain', (t) => {
  const prior = {
    value: [[0.5]],
    mass: [[1]]
  }
  const posterior = {
    value: [[1]],
    mass: [[1]]
  }
  const gain = {
    value: [[1]],
    mass: [[1]]
  }
  t.deepEqual(pat.infoGain(prior, posterior), gain)
  t.end()
})

test('len', (t) => {
  t.equal(pat.len(V), 3)
  t.end()
})

test('massMatches', (t) => {
  const h = {
    value: [[0, 1, 1], [1, 0, 1]],
    mass: [[1, 1, 0], [0, 1, 1]]
  }
  const p = {
    value: [[1], [1]],
    mass: [[1], [0]]
  }
  t.deepEqual(pat.massMatches(h, p), [
    {
      value: [[0], [1]],
      mass: [[1], [0]],
      time: 0
    },
    {
      value: [[1], [0]],
      mass: [[1], [1]],
      time: 1
    }
  ])
  t.end()
})

test('match', (t) => {
  t.true(pat.match(V, V))
  t.false(pat.match(ONESHALF, V))
  t.false(pat.match(V, ONESHALF))
  t.end()
})

test('mean', (t) => {
  t.deepEqual(pat.mean(ONESHALF), {
    value: [[1], [0]],
    mass: [[3], [0]]
  })
  t.deepEqual(pat.mean(V), {
    value: [[2 / 3], [1 / 3]],
    mass: [[3], [3]]
  })
  t.end()
})

test('mixedToPattern', (t) => {
  t.deepEqual(pat.mixedToPattern([[null, 1], [0, null]]), {
    value: [[0, 1], [0, 0]],
    mass: [[0, 1], [1, 0]]
  })
  t.end()
})

test('mutualInfo', (t) => {
  const hist = {
    value: [[1, 0], [1, 0]],
    mass: [[1, 1], [1, 1]]
  }
  const a = {
    value: [[1], [1]],
    mass: [[1], [0]]
  }
  const b = {
    value: [[1], [1]],
    mass: [[0], [1]]
  }
  t.equal(pat.mutualInfo(hist, a, b), 1)
  t.end()
})

test('single', (t) => {
  t.deepEqual(pat.single(2, 3, 1, 1), {
    value: [[1, 1, 1], [1, 1, 1]],
    mass: [[0, 0, 0], [0, 1, 0]]
  })
  t.deepEqual(pat.single(2, 2, 1, 0), {
    value: [[0, 0], [0, 0]],
    mass: [[0, 0], [0, 1]]
  })
  t.end()
})

test('slice', (t) => {
  const a = {
    value: [[0, 1, 0], [1, 0, 0]],
    mass: [[1, 1, 0], [1, 1, 0]]
  }
  t.deepEqual(pat.slice(V, 1, 4), a)
  t.end()
})

test('sliceAround', (t) => {
  const A = {
    value: [[0, 1, 1], [1, 0, 0]],
    mass: [[1, 1, 0], [1, 1, 1]]
  }
  t.deepEqual(pat.sliceAround(A, 4, 2), {
    value: [[0, 1, 1, 0], [1, 0, 0, 0]],
    mass: [[1, 1, 0, 0], [1, 1, 1, 0]],
    time: 0
  })
  t.deepEqual(pat.sliceAround(A, 2, 0), {
    value: [[0, 0], [0, 1]],
    mass: [[0, 1], [0, 1]],
    time: -1
  })
  t.deepEqual(pat.sliceAround(A, 3, 0), {
    value: [[0, 0, 1], [0, 1, 0]],
    mass: [[0, 1, 1], [0, 1, 1]],
    time: -1
  })
  t.end()
})

test('sum', (t) => {
  const a = {
    value: [[0, 1, 1], [1, 1, 0]],
    mass: [[1, 1, 0], [1, 1, 0]]
  }
  t.equal(pat.sum(a), 3)
  t.end()
})

test('toArray', (t) => {
  t.deepEqual(pat.toArray(V), [
    { channel: 0, time: 0, value: 1, mass: 1 },
    { channel: 0, time: 1, value: 0, mass: 1 },
    { channel: 0, time: 2, value: 1, mass: 1 },
    { channel: 1, time: 0, value: 0, mass: 1 },
    { channel: 1, time: 1, value: 1, mass: 1 },
    { channel: 1, time: 2, value: 0, mass: 1 }
  ])
  t.end()
})

test('union', (t) => {
  const a = {
    value: [[1, 0, 0]],
    mass: [[1, 0, 1]]
  }
  const b = {
    value: [[0, 1, 1]],
    mass: [[0, 1, 1]]
  }
  t.deepEqual(pat.union(a, b), {
    value: [[1, 1, 0]],
    mass: [[1, 1, 1]]
  })
  t.end()
})

test('width', (t) => {
  t.equal(pat.width(V), 2)
  t.end()
})
