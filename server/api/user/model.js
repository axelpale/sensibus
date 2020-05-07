const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  admin: Boolean,
  email: String,
  hash: String,
  name: String,
  status: String
})

module.exports = mongoose.model('User', userSchema)
