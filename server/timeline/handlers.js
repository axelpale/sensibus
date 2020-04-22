const databaseService = require('database-service')

exports.create = (req, res, next) => {
  databaseService.createRandomTimeline('fooman', (err, timelineId) => {
    if (err) {
      return next(err)
    }

    res.status(302).redirect('/t/' + timelineId)
  })
}

// TODO Not yet used because static file server overrides
exports.render = (req, res, next) => {
  const timelineId = req.params.timelineId
  return res.send('Timeline: ' + timelineId)
}
