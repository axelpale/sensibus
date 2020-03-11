const handlers = require('./handlers')
const router = require('express').Router()

router.get('/timeline/:timelineId', handlers.getOne)
router.post('/timeline', handlers.post)

module.exports = router
