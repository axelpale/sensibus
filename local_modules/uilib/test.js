// Testing

const uilib = require('./index')
const test = require('tape')

test('createObserver', (t) => {
  const helloChanged = uilib.createObserver([
    state => state.hello
  ])

  t.equal(helloChanged({}), false)

  const state = { hello: 'world' }
  t.equal(helloChanged(state), true)
  t.equal(helloChanged(state), false)

  t.equal(helloChanged({
    hello: 'world',
    foo: 'bar'
  }), false)

  t.equal(helloChanged({
    hello: 'universe'
  }), true)

  t.end()
})
