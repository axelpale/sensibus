const mongoose = require('mongoose')

const timelineSchema = new mongoose.Schema({
  id: String,
  title: String,
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: String,
  updatedAt: {
    type: Date,
    default: Date.now
  },
  channels: Array,
  frames: Array,
  memory: [[Number]],
  visibility: {
    type: String,
    default: 'public'
  },
  resolution: {
    type: String,
    default: 'day' // in {second, minute, hour, day, month, year, decade}
  }
})

module.exports = mongoose.model('Timeline', timelineSchema)
