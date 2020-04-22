const express = require('express')
const router = require('./routes')

const app = express()
const port = 8888

app.use(express.static('site/dist/'))

app.use('/notfound', express.static('site/dist/'))

app.use('/', router)

// return index for all the other routes (which are used and
// processed in react router in the app)
app.get('*', (req, res) => {
  return res.status(302).redirect('/notfound')
})

app.listen(port, () => console.log(`Sensibus server listening on port ${port}`))
