const way = require('senseway')

module.exports = (mem, opts) => {
  opts = Object.assign({
    reversed: true,
    heading: '',
    caption: '',
    normalize: true
  }, opts)
  return '<div class="way-container">' + way.html(mem, opts) + '</div>'
}
