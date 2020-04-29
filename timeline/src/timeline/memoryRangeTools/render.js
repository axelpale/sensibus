require('./style.css')
const way = require('senseway')
const ui = require('uilib')
const template = require('./template.ejs')

const meterText = (store) => {
  const timeline = store.getState().timeline
  const total = way.len(timeline.memory)
  const n = total - timeline.hideBefore // hideBefore is 0 when all is shown
  return 'Showing ' + n + ' frames out of ' + total
}

exports.create = (store, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('memory-range-tools', 'pt-3')

  root.innerHTML = template({})

  ui.setHtml(root, '#showMeter', meterText(store))

  ui.listen(root, '#showLessBtn', 'click', ev => {
    dispatch({
      type: 'SHOW_MORE_MEMORY',
      num: -5
    })
  })

  ui.listen(root, '#showMoreBtn', 'click', ev => {
    dispatch({
      type: 'SHOW_MORE_MEMORY',
      num: 5
    })
  })

  return root
}

exports.update = (store, dispatch) => {
  const els = ui.getElementsByClass('memory-range-tools')
  els.forEach(el => ui.setHtml(el, '#showMeter', meterText(store)))
}
