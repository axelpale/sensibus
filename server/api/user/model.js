const mongoose = require('mongoose')

// get environmental variables
require('dotenv').config()

const url = process.env.MONGODB_URI

console.log('Connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const userSchema = new mongoose.Schema({
  admin: Boolean,
  email: String,
  hash: String,
  name: String,
  status: String
})

module.exports = mongoose.model('User', userSchema)
