// Get environmental variables.
// Must be first before other requires to ensure env var visibility.
const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env')
})

// Requires
const express = require('express')
const router = require('./routes')
const mongoose = require('mongoose')

// connect to mongodb
const url = process.env.MONGODB_URI

console.log('Connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const app = express()
const port = process.env.PORT || 8888

// Set server-side rendering engine
app.set('view engine', 'ejs')

const siteClientPath = path.resolve(__dirname, '..', 'site', 'dist')

app.use(express.static(siteClientPath))

app.use('/notfound', express.static(siteClientPath))

app.use('/signup', express.static(siteClientPath))

app.use('/user/:userid', express.static(siteClientPath))

app.use('/', router)

// return index for all the other routes (which are used and
// processed in react router in the app)
app.get('*', (req, res) => {
  return res.status(302).redirect('/notfound')
})

app.listen(port, () => console.log(`Sensibus server listening on port ${port}`))
