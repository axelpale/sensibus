const express = require('express')
const sqlite = require('sqlite3')
const fs = require('fs')
const path = require('path')

const app = express()
const port = 8888
const dbdir = path.join(__dirname, 'db')
const dbpath = path.join(dbdir, 'sensibus.db')

if (!fs.existsSync(dbdir)) {
  fs.mkdirSync(dbdir)
}

const db = new sqlite.Database(dbpath, (err) => {
  if (err) {
    return console.error(err.message)
  }

  // add tables
  const querystr = 'CREATE TABLE TIMELINE(dump TEXT, userid TEXT)'
  db.run(querystr, (err) => {
    if (err) {
      return console.log(err.message)
    }
  })
})

app.use(express.static('client/'))

app.get('/api/timeline', function (req, res) {
  res.json({})
})

app.post('/api/timeline', function (req, res) {
  res.status(200).end()
})

app.listen(port, () => console.log(`Sensibus server listening on port ${port}`))
