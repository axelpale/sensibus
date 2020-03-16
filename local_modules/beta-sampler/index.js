const betaincinv = require('@stdlib/math/base/special/betaincinv')

exports.sample = (a, b) => {
  // After seeing a trues and b falses, we have a hunch of the true
  // P(true) of the bernoulli distribution. However, this is only a hunch.
  // P itself is a random variable, modeled by the beta distribution.
  //
  // The method here allows us to sample that beta distribution i.e.
  // to find possible values for P. Furthermore, it allows us to
  // compute uncertainty of predictions made by the bayesian classifier
  // via monte carlo integration.
  const p = Math.random()
  return betaincinv(p, a, b)
}
