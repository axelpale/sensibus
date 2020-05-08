const databaseService = require('database-service')

const path = require('path')
const timelineTemplate = path.resolve(__dirname, '../../timeline/index.ejs')

exports.create = (req, res, next) => {
  databaseService.createRandomTimeline('fooman', (err, timelineId) => {
    if (err) {
      return next(err)
    }

    res.status(302).redirect('/t/' + timelineId)
  })
}

exports.render = (req, res, next) => {
  // Generate timeline index page
  const timelineId = req.params.timelineId
  return res.render(timelineTemplate, {
    timelineId: timelineId
  })
}
