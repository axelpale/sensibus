module.exports = (state, model, dispatch) => {
  const root = document.createElement('div')

  root.innerHTML = '<h3>How it works</h3>' +
    '<p>This predictor guesses all 50-50. ' +
    'It does not look the data at all.</p>'

  return root
}
