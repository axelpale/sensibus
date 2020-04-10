
exports.render = (req, res, next) => {
  const timelineId = req.params.timelineId
  return res.send('Timeline: ' + timelineId)
}
