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

test('precision', (t) => {
  t.equal(problib.precision({
    truePos: 0,
    falsePos: 0
  }), 0)
  t.equal(problib.precision({
    truePos: 5,
    falsePos: 5
  }), 0.5)
  t.end()
})

test('recall', (t) => {
  t.equal(problib.recall({
    truePos: 0,
    falseNeg: 0
  }), 0)
  t.equal(problib.recall({
    truePos: 5,
    falseNeg: 5
  }), 0.5)
  t.end()
})

test('accuracy', (t) => {
  t.equal(problib.recall({
    truePos: 0,
    trueNeg: 0,
    falsePos: 0,
    falseNeg: 0
  }), 0)
  t.equal(problib.recall({
    truePos: 5,
    trueNeg: 5,
    falsePos: 5,
    falseNeg: 5
  }), 0.5)
  t.end()
})

test('f1score', (t) => {
  t.equal(problib.f1score({
    truePos: 0,
    falsePos: 0,
    falseNeg: 0
  }), 0)
  t.equal(problib.f1score({
    truePos: 5,
    falsePos: 5,
    falseNeg: 5
  }), 0.5)
  t.end()
})
