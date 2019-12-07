module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  const heading = document.createElement('h2')
  heading.innerHTML = 'Performance'
  root.appendChild(heading)

  return root
}
