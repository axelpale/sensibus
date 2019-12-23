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

  const c = state.timeline.select.channel
  const t = state.timeline.select.frame
  const channelTitle = state.timeline.channels[c].title
  const emptyField = way.fill(model.fields[0].posField, 0) // TODO use mod para
  const selected = way.set(emptyField, c, -model.fieldOffset, 1)

  let innerHTML = ''

  // Get prediction data for the selected cell.
  const cellResult = (() => {
    return model.cellResults.find(cellResult => {
      return cellResult.cell.channel === c && cellResult.cell.time === t
    })
  })()

  // General info that does not depend if the selected cell is unknown or not.
  innerHTML += generalTemplate({
    channelTitle: channelTitle,
    c: state.timeline.select.channel,
    t: state.timeline.select.frame,
    memory: state.timeline.way,
    predictedValue: cellResult ? cellResult.prediction.toFixed(2) : 'N/A',
    posField: renderWay(model.fields[c].posField, {
      heading: 'If ' + channelTitle + ' then',
      caption: 'in general.',
      selected: selected
    }),
    negField: renderWay(model.fields[c].negField, {
      heading: 'If not ' + channelTitle + ' then',
      caption: 'in general.',
      selected: selected
    })
  })

  if (cellResult) {
    // A unknown cell is selected. Show how we predict its value.
    const ctx = cellResult.context
    const selected = way.set(way.fill(ctx, 0), c, -model.fieldOffset, 1)

    innerHTML += template({
      contextHtml: renderWay(ctx, {
        heading: 'Selection context',
        selected: selected
      }),
      posFactorsHtml: renderWay(cellResult.posFactors, {
        heading: 'Likelihood factors for positive',
        selected: selected
      }),
      negFactorsHtml: renderWay(cellResult.negFactors, {
        heading: 'Likelihood factors for negative',
        selected: selected
      }),
      posPrior: cellResult.posPrior,
      negPrior: cellResult.negPrior,
      posSupport: cellResult.posSupport,
      negSupport: cellResult.negSupport,
      posProb: cellResult.posProb,
      negProb: cellResult.negProb
    })
  }

  root.innerHTML = innerHTML
  return root
}
