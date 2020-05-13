const path = require('path')
const timelineTemplate = path.resolve(__dirname, '../../timeline/index.ejs')

exports.render = (req, res, next) => {
  // Generate timeline index page
  const timelineId = req.params.timelineId
  return res.render(timelineTemplate, {
    timelineId: timelineId
  })
}
