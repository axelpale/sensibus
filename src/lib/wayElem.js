const way = require('senseway')

module.exports = (wa, opts) => {
  const el = document.createElement('div')
  el.classList.add('how-way-container')
  el.innerHTML = way.html(wa, opts)
  return el
}
