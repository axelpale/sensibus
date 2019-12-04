// Multi-channel binary predictor
//
const lib = require('./lib');
const binaryEntropy = require('./binaryEntropy');
const way = require('senseway');

exports.past = (hist, t, size) => {
  // Multi-channel past
  return way.before(hist, t, size)
};

exports.future = (hist, t, size) => {
  // Multi-channel future
  return way.after(hist, t, size)
};

exports.gain = binaryEntropy;

exports.naive = require('./naive');
exports.pattern = require('./pattern');
