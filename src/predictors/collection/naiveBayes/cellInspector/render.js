const generalTemplate = require('./general.ejs')
const template = require('./template.ejs')
const way = require('senseway')

module.exports = (state, local, dispatch) => {
  const root = document.createElement('div')
  let innerHTML = ''

  // Get prediction data for the selected cell.
  const predictedCell = (() => {
    const select = state.timeline.select
    if (select) {
      const c = select.channel
      const t = select.frame
      return local.predictedCells.find(cell => {
        return cell.unknownCell.channel === c && cell.unknownCell.time === t
      })
    }
    // Return undefined otherwise
  })()

  // General info that does not depend if the selected cell is unknown or not.
  innerHTML += generalTemplate({
    c: state.timeline.select.channel,
    t: state.timeline.select.frame,
    memory: state.timeline.way,
    predictedValue: predictedCell ? predictedCell.decision.toFixed(2) : 'N/A'
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

    innerHTML += template({
      contextHtml: contextHtml
    })
  }

  root.innerHTML = innerHTML
  return root
}
