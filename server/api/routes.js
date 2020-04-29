const handlers = require('./handlers')
const router = require('express').Router()

router.get('/timeline', handlers.get)
router.post('/timeline', handlers.create)

router.get('/timeline/:timelineId', handlers.getOne)

module.exports = router
