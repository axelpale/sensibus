const Timeline = require('./model')

exports.getOne = (req, res, next) => {
  const timelineId = req.params.timelineId

  // TODO validate timelineId

  // Fetch row from database
  Timeline.findOne({ id: timelineId })
    .then(timeline => {
      if (timeline) {
        res.json(timeline)
      } else {
        res.status(404).send('Timeline not found')
      }
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).end()
    })
}

exports.create = (req, res, next) => {
  const userId = 'fooman'

  const timelineId = 'test_timeline'
  Timeline.create(
    {
      id: timelineId,
      title: '123',
      createdBy: userId,
      updatedBy: userId,
      channels: [],
      frames: [],
      memory: [[1]]
    })
    .then(() => {
      res.json({
        timelineId: timelineId
      })
    }).catch((err) => {
      console.log(err.message)
      res.status(500).end()
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
  Timeline.find(opts)
    .then(timelineMetas => {
      res.json(timelineMetas)
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).end()
    })
}
