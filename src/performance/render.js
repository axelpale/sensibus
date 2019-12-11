module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  const heading = document.createElement('h2')
  heading.innerHTML = 'Performance'
  root.appendChild(heading)

  const row = (title, value, decimals) => {
    decimals = typeof decimals === 'undefined' ? 0 : decimals
    const el = document.createElement('p')
    el.innerHTML = title + ': ' + value.toFixed(decimals)
    root.appendChild(el)
  }

  const perf = state.performance
  row('Number of tests', perf.numTrainingSets)
  row('True positives', perf.truePos, 2)
  row('True negatives', perf.trueNeg, 2)
  row('False positives', perf.falsePos, 2)
  row('False negatives', perf.falseNeg, 2)
  row('Avg. Score', perf.score, 2)

  return root
}
