const mongoose = require('mongoose')

const timelineSchema = new mongoose.Schema({
  creator: String
})

module.exports = mongoose.model('Timeline', timelineSchema)
