const databaseService = require('database-service')

exports.getOne = (req, res, next) => {
  const timelineId = req.params.timelineId

  // TODO validate timelineId

  // Fetch row from database
  databaseService.getOneTimeline('fooman', (err, timelineStr) => {
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
  databaseService.setOneTimeline('randomdummytimeline', 'fooman', (err) => {
    if (err) {
      return next(err)
    }

    res.status(200).end()
  })
}
