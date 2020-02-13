const headingTemplate = require('./heading.ejs')
const contentTemplate = require('./content.ejs')
const way = require('senseway')
const renderWay = require('../renderWay')

module.exports = (state, model, dispatch) => {
  const root = document.createElement('div')

  const showMore = model.inferringInsights
  const heading = document.createElement('div')

  heading.innerHTML = headingTemplate({
    showMore: showMore
  })

  heading.querySelector('.show-moreless').addEventListener('click', ev => {
    ev.preventDefault()
    dispatch({
      type: 'TOGGLE_INFERRING_INSIGHTS',
      toggleTo: !showMore
    })
  })

  root.appendChild(heading)

  if (!showMore) {
    return root
  }

  // Inferring inspector is only for selections
  if (!state.timeline.select) {
    return root
  }

  const c = state.timeline.select.channel
  const t = state.timeline.select.frame

  // Get prediction data for the selected cell.
  const cellResult = (() => {
    return model.cellResults.find(cellResult => {
      return cellResult.cell.channel === c && cellResult.cell.time === t
    })
  })()

  if (!cellResult) {
    // No prediction results for the cell.
    return root
  }
  // A cell is selected. Show how we predict its value.

  const emptyField = way.fill(model.fields[0]['1'].prob, 0)
  const fieldOffset = model.fieldLength - 1
  const selected = way.set(emptyField, c, fieldOffset, 1)

  const titleFn = (q, ci, ti) => {
    const chTitle = state.timeline.channels[ci].title
    return q.toFixed(2) + ' ' + chTitle
  }

  const content = document.createElement('div')
  content.innerHTML = contentTemplate({
    contextHtml: renderWay(cellResult.context, {
      heading: 'Neigh&shy;bor&shy;hood of the se&shy;lec&shy;ted cell',
      selected: selected,
      title: titleFn
    }),
    posFactorsHtml: renderWay(cellResult.posFactors, {
      heading: 'Like&shy;li&shy;hood fac&shy;tors for posi&shy;tive',
      selected: selected,
      title: titleFn
    }),
    negFactorsHtml: renderWay(cellResult.negFactors, {
      heading: 'Like&shy;lih&shy;ood fac&shy;tors for nega&shy;tive',
      selected: selected,
      title: titleFn
    }),
    posPrior: cellResult.posPrior,
    negPrior: cellResult.negPrior,
    posSupport: cellResult.posSupport,
    negSupport: cellResult.negSupport,
    posProb: cellResult.posProb,
    negProb: cellResult.negProb
  })

  root.appendChild(content)

  return root
}
