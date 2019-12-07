module.exports = (state, dispatch) => {
  const root = document.createElement('div')

  const s = state.timeline.select
  const heading = document.createElement('h2')
  heading.innerHTML = 'Cell (' + s.channel + ',' + s.frame + ')'
  root.appendChild(heading)

  return root
}
