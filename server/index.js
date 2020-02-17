const express = require('express')
const app = express()
const port = 8888

app.use(express.static('client/'))

app.get('/api/timeline', function (req, res) {
  res.send('Hello GET')
})

app.post('/api/timeline', function (req, res) {
  res.send('Hello POST')
})

app.listen(port, () => console.log(`Sensibus server listening on port ${port}`))
