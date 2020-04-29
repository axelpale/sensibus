const handlers = require('./handlers')
const router = require('express').Router()

router.get('/', handlers.get)
router.post('/', handlers.create)

router.get('/:timelineId', handlers.getOne)

module.exports = router
