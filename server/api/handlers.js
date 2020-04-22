const dbs = require('database-service')

exports.getOne = (req, res, next) => {
  const timelineId = req.params.timelineId

  // TODO validate timelineId

  // Fetch row from database
  dbs.getOneTimeline('fooman', (err, timelineStr) => {
    if (err) {
      return next(err)
    }

    if (timelineStr === null) {
      return res.status(404).send('Timeline not found')
    }

    // Return timeline to client
    return res.json({
      id: timelineId,
      timeline: timelineStr
    })
  })
}

exports.create = (req, res, next) => {
  const userId = 'fooman'
  dbs.createRandomTimeline(userId, (err, timelineId) => {
    if (err) {
      return next(err)
    }

    res.json({
      timelineId: timelineId
    })
  })
}
