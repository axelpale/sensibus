module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  const heading = document.createElement('h2')
  heading.innerHTML = 'Performance'
  root.appendChild(heading)

  const score = document.createElement('p')
  score.innerHTML = 'Score: ' + state.performance.score.toFixed(2)
  root.appendChild(score)

  return root
}
