const User = require('../user/model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const shortid = require('shortid')

exports.signUp = (req, res, next) => {
  // Create non-admin active user. Does not check if user exists.
  //
  // Body Parameters:
  //   username
  //     string
  //   email
  //     string
  //   password
  //     string
  //   callback
  //     function (err)

  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  // Bcrypt salt rounds
  const r = 10

  bcrypt.hash(password, r, function (berr, pwdHash) {
    if (berr) {
      return next(berr)
    }

    // TODO what if conflict?
    const userId = shortid.generate() + shortid.generate()

    const user = new User({
      id: userId,
      admin: false,
      email: email,
      hash: pwdHash,
      name: username,
      status: 'active' // in {active, deactivated}
    })

    user.save().then(result => {
      console.log('User created: ' + username) // DEBUG
      return res.json(result)
    }).catch(next)
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
        id: user.id,
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
