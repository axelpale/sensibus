const router = require('express').Router()
const apiRouter = require('./api/routes')
const timelineRouter = require(('./timeline/routes'))

router.use('/api', apiRouter)
router.use('/t', timelineRouter)

module.exports = router
