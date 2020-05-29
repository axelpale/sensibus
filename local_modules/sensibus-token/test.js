const test = require('tape')
const jwt = require('jsonwebtoken')
require('./mock-local-storage')

const sbtoken = require('./index')

// Generate some values to test against.
const SITE_SECRET = 'thisisasecret'
const INVALID_TOKEN = 'abc'
const VALID_TOKEN = jwt.sign({
  admin: false,
  id: '123',
  name: 'Ab C',
  email: 'a@b.c'
}, SITE_SECRET, {
  expiresIn: '1d'
})
const LACKING_TOKEN = jwt.sign({
  id: '123'
}, SITE_SECRET, {
  expiresIn: '1d'
})

test('initial state', (t) => {
  t.equal(sbtoken.getToken(), null)
  t.equal(sbtoken.hasToken(), false)
  t.equal(sbtoken.getUser(), null)
  t.end()
})

test('detect malformed token', (t) => {
  t.throws(() => {
    sbtoken.setToken(INVALID_TOKEN)
  }, /invalid/i, 'invalid token should throw')
  t.end()
})

test('detect missing props', (t) => {
  t.throws(() => {
    sbtoken.setToken(LACKING_TOKEN)
  }, /missing/i)
  t.end()
})

test('parse valid token', (t) => {
  t.equal(sbtoken.hasToken(), false)
  sbtoken.setToken(VALID_TOKEN)
  t.equal(typeof sbtoken.getToken(), 'string')
  t.equal(typeof sbtoken.getUser(), 'object')
  t.equal(typeof sbtoken.getUser().admin, 'boolean')
  t.end()
})

test('token removal', (t) => {
  t.equal(sbtoken.hasToken(), true)
  sbtoken.removeToken()
  t.equal(sbtoken.hasToken(), false)
  t.equal(sbtoken.getToken(), null)
  t.equal(sbtoken.getUser(), null)
  t.end()
})

test('getDecoded', (t) => {
  t.equal(sbtoken.getDecoded(), null)
  sbtoken.setToken(VALID_TOKEN)
  t.equal(typeof sbtoken.getDecoded(), 'object')
  t.equal(typeof sbtoken.getDecoded().iat, 'number')

  const decoded = sbtoken.getDecoded()
  decoded.hazard = 'hahaa'
  t.equal(typeof sbtoken.getDecoded().hazard, 'undefined', 'is immutable')

  t.end()
})
