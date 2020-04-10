const express = require('express')
const path = require('path')
const router = require('./routes')

const app = express()
const port = 8888

app.use(express.static('site/dist/'))

app.use('/', router)

// return index for all the other routes (which are used and
// processed in react router in the app)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../site/dist/index.html'))
})

app.listen(port, () => console.log(`Sensibus server listening on port ${port}`))
