const dbs = require('database-service')
const Timeline = require('./model')

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

exports.get = (req, res, next) => {
  if (req.query.sort === 'popular') {
    return res.json([
      {
        timelineId: 'world-history',
        title: 'World History',
        userId: 'juissi999'
      },
      {
        timelineId: 'stockmarket',
        title: 'Stock Market',
        userId: 'axelpale'
      }
    ])
  }

  // Default: sort=recent
  const opts = {}
  dbs.getRecentTimelines(opts, (err, timelineMetas) => {
    if (err) {
      return next(err)
    }
    return res.json(timelineMetas)
  })
}
