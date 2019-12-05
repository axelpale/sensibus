module.exports = (state, dispatch) => {
  const root = document.createElement('div')
  root.innerHTML = '<span>' + state.timeline.frames.length + '</span>'
  return root
}
