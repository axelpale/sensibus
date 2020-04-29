const accountRouter = require('./account/routes')
const timelineRouter = require('./timeline/routes')
const router = require('express').Router()

router.use('/account', accountRouter)
router.use('/timeline', timelineRouter)

module.exports = router
