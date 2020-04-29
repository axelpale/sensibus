const handlers = require('./handlers')
const accountRouter = require('./account/routes')
const router = require('express').Router()

router.use('/account', accountRouter)

router.get('/timeline', handlers.get)
router.post('/timeline', handlers.create)

router.get('/timeline/:timelineId', handlers.getOne)

module.exports = router
