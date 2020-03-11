var router = require('express').Router()
var apiRouter = require('./api/routes')

router.use('/api', apiRouter)

module.exports = router
