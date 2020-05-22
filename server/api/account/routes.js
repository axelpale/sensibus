const handlers = require('./handlers')
const bodyParser = require('body-parser')
const router = require('express').Router()

const jsonParser = bodyParser.json()

router.post('/login', jsonParser, handlers.logIn)
router.post('/signup', jsonParser, handlers.signUp)

module.exports = router
