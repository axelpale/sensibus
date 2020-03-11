exports.getOne = (req, res) => {
  const timelineId = req.params.timelineId

  // TODO validate timelineId

  // Fetch row from database

  // Return timeline to client
  res.json({
    id: timelineId
  })
}

exports.post = (req, res) => {
  res.status(200).end()
}
