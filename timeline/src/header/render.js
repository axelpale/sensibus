require('./style.css')
const iconUrl = require('./icon.png').default

const template = require('./template.ejs')

exports.create = (store, dispatch) => {
  const root = document.createElement('div')
  root.id = 'sb-header-container'
  root.innerHTML = template({
    iconUrl: iconUrl
  })
  return root
}

exports.update = (store, dispatch) => {
}
