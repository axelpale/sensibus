// Testing

const problib = require('./index')
const test = require('tape')

test('divergence', (t) => {
  t.equal(problib.divergence(1, 0.5), 1)
  t.end()
})

test('mutualInfo', (t) => {
  t.equal(problib.mutualInfo(0.5, 0.5, 0, 1), 1)
  t.end()
})
