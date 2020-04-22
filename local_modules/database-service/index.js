const sqlite = require('sqlite3')
const fs = require('fs')
const shortid = require('shortid')

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

  // Create tables
  const querystr = 'CREATE TABLE IF NOT EXISTS timeline (' +
    'timelineId varchar(255),' +
    'dump TEXT,' +
    'userId TEXT' +
    ')'

  db.run(querystr, (err) => {
    if (err) {
      return console.log(err.message)
    }
  })
})

exports.createRandomTimeline = (userId, cb) => {
  // Parameters:
  //   userId
  //   cb: fn (err, timelineId)
  //
  const timelineId = shortid.generate()

  const query = 'INSERT INTO timeline (timelineId, dump, userId) ' +
    'VALUES (?, ?, ?)'

  db.run(query, [timelineId, '{}', userId], (err) => {
    return cb(err, timelineId)
  })
}

exports.getOneTimeline = (userId, cb) => {
  db.get('SELECT * FROM timeline WHERE userId=?', (userId), (err, row) => {
    if (err) {
      return cb(err)
    }

    if (typeof row === 'undefined') {
      return cb(null, null)
    }

    cb(null, row.dump)
  })
}

exports.setOneTimeline = (timelineId, timelineDump, userId, cb) => {
  const query = 'INSERT INTO timeline (timelineId, dump, userId) ' +
    'VALUES (?, ?, ?)'
  db.run(query, [timelineId, timelineDump, userId], (err) => {
    if (err) {
      return cb(err)
    }
    cb()
  })
}
