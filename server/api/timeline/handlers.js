const Timeline = require('./model')
const shortid = require('shortid')

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

  const timelineId = shortid.generate()
  Timeline.create({
    id: timelineId,
    title: 'Untitled',
    createdBy: userId,
    updatedBy: userId,
    channels: [],
    frames: [],
    memory: [[1]]
  }).then(() => {
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
        id: 'world-history',
        title: 'World History',
        createdBy: 'juissi999',
        createdAt: 'asdfasdf'
      },
      {
        id: 'stockmarket',
        title: 'Stock Market',
        createdBy: 'axelpale',
        createdAt: 'something'
      }
    ])
  }

  // Default: sort=recent
  // TODO select only "meta", do not include e.g. memory
  const filter = {}
  Timeline.find(filter)
    .select('id title createdBy createdAt')
    .limit(10)
    .then(timelineMetas => {
      res.json(timelineMetas)
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).end()
    })
}

exports.feedEvent = (req, res, next) => {
  //
  const timelineId = req.params.timelineId
  // TODO process events instead of overwriting everything.
  const channels = req.body.channels
  const frames = req.body.frames
  const memory = req.body.memory

  Timeline.findOne({ id: timelineId }).then(timeline => {
    if (!timeline) {
      return res.status(404).json({
        success: false,
        message: 'Timeline not found'
      })
    }

    // Replace values. TODO do this via a delta event.
    timeline.channels = channels
    timeline.frames = frames
    timeline.memory = memory

    // Update meta
    timeline.updatedAt = Date.now()
    timeline.updatedBy = 'fooman' // TODO req.user.name

    // TODO Avoid the race condition between read and save.

    timeline.save().then(() => {
      // Response with some details about the update.
      return res.json({
        success: true
      })
    }).catch(err => {
      return next(err)
    })
  }).catch(err => {
    return next(err)
  })
}
