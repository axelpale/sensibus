const express = require('express')
const router = express.Router()
const handlers = require('./handlers')
const path = require('path')

const timelineClientPath = path.resolve(__dirname, '../../timeline')

router.get('/:timelineId', handlers.render)
router.use('/:timelineId', express.static(timelineClientPath))

module.exports = router
