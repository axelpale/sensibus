module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  root.innerHTML = '<h3>How it works</h3>' +
    '<p>This predictor guesses that the value of ' +
    'the previous frame repeats. It performs surprisingly well.</p>'

  return root
}
