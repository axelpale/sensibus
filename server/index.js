const express = require('express')
const app = express()
const port = 8888

app.use(express.static('client/'))

app.listen(port, () => console.log(`Sensibus server listening on port ${port}`))