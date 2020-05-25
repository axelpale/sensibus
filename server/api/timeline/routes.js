const handlers = require('./handlers')
const router = require('express').Router()
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()

router.get('/', handlers.get)
router.post('/', handlers.create)

router.get('/:timelineId', handlers.getOne)
router.post('/:timelineId/event', jsonParser, handlers.feedEvent)

module.exports = router
