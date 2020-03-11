const express = require('express')

const router = require('./routes')

const app = express()
const port = 8888

app.use(express.static('client/'))

app.use('/', router)

app.listen(port, () => console.log(`Sensibus server listening on port ${port}`))
