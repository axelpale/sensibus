const generalTemplate = require('./general.ejs')
const template = require('./template.ejs')
const way = require('senseway')

module.exports = (state, local, dispatch) => {
  const root = document.createElement('div')
  let innerHTML = ''

  const c = state.timeline.select.channel
  const t = state.timeline.select.frame

  const predictedCell = local.predictedCells.find(cell => {
    return cell.unknownCell.channel === c && cell.unknownCell.time === t
  })

  innerHTML += generalTemplate({
    c: state.timeline.select.channel,
    t: state.timeline.select.frame,
    memory: state.timeline.way,
    predictedValue: predictedCell ? predictedCell.avg.toFixed(2) : 'N/A'
  })

  if (predictedCell) {
    const contextHtml = [predictedCell.context].map(ctx => {
      const selected = way.set(way.fill(ctx, 0), c, -local.fieldOffset, 1)
      return '<div class="way-container">' + way.html(ctx, {
        reversed: true,
        heading: 'Context',
        caption: '',
        normalize: true,
        selected: selected
      }) + '</div>'
    })[0]

    innerHTML += template({
      contextHtml: contextHtml
    })
  }

  root.innerHTML = innerHTML
  return root
}
