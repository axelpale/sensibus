const generalTemplate = require('./general.ejs')
const template = require('./template.ejs')
const way = require('senseway')

const renderWay = (mem, opts) => {
  opts = Object.assign({
    reversed: true,
    heading: '',
    caption: '',
    normalize: true
  }, opts)
  return '<div class="way-container">' + way.html(mem, opts) + '</div>'
}

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
    predictedValue: predictedCell ? predictedCell.decision.toFixed(2) : 'N/A'
  })

  if (predictedCell) {
    // A unknown cell is selected. Show how we predict its value.
    const cell = predictedCell
    const c = cell.unknownCell.channel

    const ctx = cell.context
    const selected = way.set(way.fill(ctx, 0), c, -local.fieldOffset, 1)

    innerHTML += template({
      contextHtml: renderWay(ctx, {
        heading: 'Context',
        selected: selected
      }),
      posFactorsHtml: renderWay(cell.posFactors, {
        heading: 'Likelihood Factors for Positive',
        selected: selected
      }),
      negFactorsHtml: renderWay(cell.negFactors, {
        heading: 'Likelihood Factors for Negative',
        selected: selected
      }),
      posSupport: predictedCell.posSupport,
      negSupport: predictedCell.negSupport
    })
  }

  root.innerHTML = innerHTML
  return root
}
