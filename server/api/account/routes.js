const handlers = require('./handlers')
const bodyParser = require('body-parser')
const router = require('express').Router()

router.post('/', bodyParser.json(), handlers.signUp)

module.exports = router
