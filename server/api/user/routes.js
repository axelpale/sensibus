const handlers = require('./handlers')
const router = require('express').Router()

router.get('/:userId', handlers.getUser)

module.exports = router
