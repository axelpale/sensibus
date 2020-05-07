const User = require('./model')

exports.getUser = (req, res, next) => {
  User.find({ name: req.params.userId })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => {
      console.log(err.message)
      res.status(400).end()
    })
}
