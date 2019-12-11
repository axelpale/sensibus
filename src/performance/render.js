const template = require('./template.ejs')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')
  root.innerHTML = template(state.performance)
  return root.firstChild
}
