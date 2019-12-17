const generalTemplate = require('./general.ejs')
const template = require('./template.ejs')
const way = require('senseway')

module.exports = (state, local, dispatch) => {
  const root = document.createElement('div')

  // Cell inspector is only for selections
  if (!state.timeline.select) {
    return root
  }

  let innerHTML = ''

  // Get prediction data for the selected cell.
  const predictedCell = (() => {
    const select = state.timeline.select
    const c = select.channel
    const t = select.frame
    return local.predictedCells.find(cell => {
      return cell.unknownCell.channel === c && cell.unknownCell.time === t
    })
  })()

  // General info that does not depend if the selected cell is unknown or not.
  innerHTML += generalTemplate({
    c: state.timeline.select.channel,
    t: state.timeline.select.frame,
    memory: state.timeline.way,
    predictedValue: predictedCell ? predictedCell.avg.toFixed(2) : 'N/A'
  })

  if (predictedCell) {
    // A unknown cell is selected. Show how we predict its value.
    const c = predictedCell.unknownCell.channel

    const ctx = predictedCell.context
    const selected = way.set(way.fill(ctx, 0), c, -local.fieldOffset, 1)

    const contextHtml = '<div class="way-container">' + way.html(ctx, {
      reversed: true,
      heading: 'Context',
      caption: '',
      normalize: true,
      selected: selected
    }) + '</div>'

    const valueField = local.fields[c].valueField
    const fieldHtml = '<div class="way-container">' + way.html(valueField, {
      reversed: true,
      heading: 'Value Field',
      caption: '',
      normalize: true,
      selected: selected
    }) + '</div>'

    innerHTML += template({
      contextHtml: contextHtml,
      fieldHtml: fieldHtml
    })
  }

  root.innerHTML = innerHTML
  return root
}
