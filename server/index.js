const express = require('express')
const sqlite = require('sqlite3')
const fs = require('fs')
const path = require('path')

const router = require('./routes')

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
  const querystr = 'CREATE TABLE IF NOT EXISTS TIMELINE(dump TEXT, userid TEXT)'
  db.run(querystr, (err) => {
    if (err) {
      return console.log(err.message)
    }
  })
})

app.use(express.static('client/'))

app.use('/', router)

app.listen(port, () => console.log(`Sensibus server listening on port ${port}`))
