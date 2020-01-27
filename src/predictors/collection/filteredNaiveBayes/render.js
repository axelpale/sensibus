const renderControls = require('./controls/render')
const inspector = require('./inspector/render')

module.exports = (state, local, dispatch) => {
  const root = document.createElement('div')

  root.innerHTML = '<h3>How it works</h3>' +
    '<p>For each different value of each channel, this predictor ' +
    'notices how the neighborhood of the value look like in average. ' +
    'To predict an unknown value, it compares the neighborhood ' +
    'of the unknown to the average neighborhood of each possible value. ' +
    'It chooses the value whose neighborhood best resembles ' +
    'the neighborhood of the unknown, when weighted by the prior probability ' +
    'in which the value occurs in the data. ' +
    'These are the basics of the naïve Bayes classification.</p>'

  // Selection related data
  root.appendChild(inspector(state, local, dispatch))

  // Controls
  root.appendChild(renderControls(state, local, dispatch))

  return root
}
