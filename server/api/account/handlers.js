// where should this model be located?
const User = require('../user/model')

exports.signUp = (req, res, next) => {
  const user = new User({
    admin: false,
    email: req.body.email,
    hash: req.body.password,
    name: req.body.username,
    status: 'active'
  })

  user.save().then(result => {
    console.log('note saved!')
    // mongoose.connection.close()
    return res.json(result)
  })
}
