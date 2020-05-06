const accountRouter = require('./account/routes')
const userRouter = require('./user/routes')
const timelineRouter = require('./timeline/routes')
const router = require('express').Router()

router.use('/account', accountRouter)
router.use('/timeline', timelineRouter)
router.use('/user', userRouter)

module.exports = router
