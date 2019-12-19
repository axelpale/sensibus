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

module.exports = (state, model, dispatch) => {
  const root = document.createElement('div')

  // Cell inspector is only for selections
  if (!state.timeline.select) {
    return root
  }

  let innerHTML = ''

  // Get prediction data for the selected cell.
  const cellResult = (() => {
    const select = state.timeline.select
    const c = select.channel
    const t = select.frame
    return model.cellResults.find(cellResult => {
      return cellResult.cell.channel === c && cellResult.cell.time === t
    })
  })()

  // General info that does not depend if the selected cell is unknown or not.
  innerHTML += generalTemplate({
    c: state.timeline.select.channel,
    t: state.timeline.select.frame,
    memory: state.timeline.way,
    predictedValue: cellResult ? cellResult.prediction.toFixed(2) : 'N/A'
  })

  if (cellResult) {
    // A unknown cell is selected. Show how we predict its value.
    const c = cellResult.cell.channel
    const ctx = cellResult.context
    const selected = way.set(way.fill(ctx, 0), c, -model.fieldOffset, 1)

    innerHTML += template({
      contextHtml: renderWay(ctx, {
        heading: 'Context',
        selected: selected
      }),
      posFactorsHtml: renderWay(cellResult.posFactors, {
        heading: 'Likelihood Factors for Positive',
        selected: selected
      }),
      negFactorsHtml: renderWay(cellResult.negFactors, {
        heading: 'Likelihood Factors for Negative',
        selected: selected
      }),
      posSupport: cellResult.posSupport,
      negSupport: cellResult.negSupport,
      posProb: cellResult.posProb,
      negProb: cellResult.negProb
    })
  }

  root.innerHTML = innerHTML
  return root
}
