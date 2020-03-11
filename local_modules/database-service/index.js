const sqlite = require('sqlite3')
const fs = require('fs')

const path = require('path')
const dbdir = path.resolve(__dirname, '../../server/db')
const dbpath = path.join(dbdir, 'sensibus.db')

if (!fs.existsSync(dbdir)) {
  fs.mkdirSync(dbdir)
}

const db = new sqlite.Database(dbpath, (err) => {
  if (err) {
    return console.error(err.message)
  }

  // add tables
  const querystr = 'CREATE TABLE IF NOT EXISTS timeline(dump TEXT, userid TEXT)'
  db.run(querystr, (err) => {
    if (err) {
      return console.log(err.message)
    }
  })
})

exports.getOneTimeline = (userid, cb) => {
  db.get('SELECT * FROM timeline WHERE userid=?', (userid), (err, row) => {
    if (err) {
      return cb(err)
    }

    if (typeof row === 'undefined') {
      return cb(null, null)
    }

    cb(null, row.dump)
  })
}

exports.setOneTimeline = (timelinestr, userid, cb) => {
  db.run('INSERT INTO timeline (dump, userid) VALUES (?,?)', [timelinestr, userid], (err) => {
    if (err) {
      return cb(err)
    }
    cb()
  })
}
