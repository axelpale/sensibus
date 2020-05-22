const User = require('../user/model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signUp = (req, res, next) => {
  const user = new User({
    admin: false,
    email: req.body.email,
    hash: req.body.password, // TODO bcrypt hash
    name: req.body.username,
    status: 'active'
  })

  user.save().then(result => {
    console.log('note saved!')
    // mongoose.connection.close()
    return res.json(result)
  })
}

exports.logIn = function (req, res, next) {
  // Parameters:
  //   req.body
  //     Required keys:
  //       email: <string>
  //       password: <string>
  //

  var email = req.body.email
  var password = req.body.password

  // If injection attempted or no email or password provided.
  if (typeof email !== 'string' || typeof password !== 'string' ||
      email.length < 1 || password.length < 1) {
    return res.status(400).send('Invalid credentials')
  }

  // Also allow login with username.
  var q = {
    $or: [
      { name: email },
      { email: email }
    ]
  }

  User.findOne(q, function (err, user) {
    if (err) {
      return next(err)
    }

    if (user === null) {
      return res.status(401).send('Unauthorized')
    }

    // TODO repeat bcrypt N times, where N is specified
    bcrypt.compare(password, user.hash, function (err2, match) {
      if (err2) {
        // Hash comparison failed. Password might still be correct, though.
        return next(err2)
      }

      if (!match) {
        // no password match => Authentication failure
        return res.status(401).send('Unauthorized')
      }

      // Else, success. Passwords match.

      // TODO what if email is not yet verified?

      // Build jwt token
      const tokenPayload = {
        name: user.name,
        email: user.email,
        admin: user.admin
      }

      // The following will add 'exp' property to payload.
      // For time formatting, see https://github.com/zeit/ms
      const tokenOptions = {
        expiresIn: '60d' // two months,
      }

      const token = jwt.sign(tokenPayload, process.env.SECRET, tokenOptions)

      // Successful login.
      // DEBUG
      console.log(user.name + ' logged in.')

      return res.json(token)
    })
  })
}
