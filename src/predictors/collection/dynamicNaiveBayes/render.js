const renderControls = require('./controls/render')
const cellInspector = require('./cellInspector/render')

module.exports = (state, local, dispatch) => {
  const root = document.createElement('div')

  // Selection related data
  root.appendChild(cellInspector(state, local, dispatch))

  // Controls
  root.appendChild(renderControls(state, local, dispatch))

  return root
}
