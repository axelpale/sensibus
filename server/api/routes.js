const handlers = require('./handlers')
const router = require('express').Router()

router.get('/timeline', handlers.get)
router.post('/timeline', handlers.post)

module.exports = router
