require('./style.css')
const template = require('./template.ejs')

exports.create = (store, dispatch) => {
  const root = document.createElement('div')
  root.id = 'sb-header-container'
  root.innerHTML = template({})
  return root
}

exports.update = (store, dispatch) => {
}
