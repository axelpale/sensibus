const router = require('express').Router()
const handlers = require('./handlers')

router.get('/:timelineId', handlers.render)

module.exports = router
