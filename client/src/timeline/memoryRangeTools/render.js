const uilib = require('uilib')
const template = require('./template.ejs')

const listen = uilib.listen

exports.create = (store, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('memory-range-tools')

  root.innerHTML = template({})

  listen(root, '#showLessBtn', 'click', ev => {
    dispatch({
      type: 'SHOW_MORE_MEMORY',
      num: -5
    })
  })

  listen(root, '#showMoreBtn', 'click', ev => {
    dispatch({
      type: 'SHOW_MORE_MEMORY',
      num: 5
    })
  })

  return root
}

exports.update = (state, dispatch) => {

}
