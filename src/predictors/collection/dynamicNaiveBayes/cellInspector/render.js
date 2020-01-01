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

const gain = (priors, posterior) => {
  return way.map(posterior, (pos, c, t) => {
    const pri = priors[c]
    // Kullback-Leibler divergence
    const x0 = (pos === 1) ? 0 : (1 - pos) * Math.log2((1 - pos) / (1 - pri))
    const x1 = (pos === 0) ? 0 : pos * Math.log2(pos / pri)
    return x0 + x1
  })
}

const tritToProb = t => {
  return (1 + t) / 2
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

  const titleFn = (q, ci, ti) => {
    const chTitle = state.timeline.channels[ci].title
    return q.toFixed(2) + ' ' + chTitle
  }

  let innerHTML = ''

  // Get prediction data for the selected cell.
  const cellResult = (() => {
    return model.cellResults.find(cellResult => {
      return cellResult.cell.channel === c && cellResult.cell.time === t
    })
  })()

  const priors = model.priors.map(tritToProb)
  const posField = way.map(model.fields[c].posField, tritToProb)
  const negField = way.map(model.fields[c].negField, tritToProb)
  const posGain = way.set(gain(priors, posField), c, -model.fieldOffset, 0)
  const negGain = way.set(gain(priors, negField), c, -model.fieldOffset, 0)

  // General info that does not depend if the selected cell is unknown or not.
  innerHTML += generalTemplate({
    channelTitle: channelTitle,
    c: c,
    t: t,
    givenValue: state.timeline.memory[c][t],
    predictedValue: cellResult ? cellResult.prediction.toFixed(2) : 'N/A',
    posField: renderWay(model.fields[c].posField, {
      heading: 'If ' + channelTitle + ' then',
      caption: 'in average.',
      selected: selected,
      title: titleFn
    }),
    negField: renderWay(model.fields[c].negField, {
      heading: 'If not ' + channelTitle + ' then',
      caption: 'in average.',
      selected: selected,
      title: titleFn
    }),
    posGain: renderWay(posGain, {
      heading: 'Difference to channel average around ' + channelTitle,
      selected: selected,
      title: titleFn
    }),
    negGain: renderWay(negGain, {
      heading: 'Difference to channel average around not ' + channelTitle,
      selected: selected,
      title: titleFn
    }),
    priors: renderWay(model.priors.map(t => [t]), {
      heading: 'Channel averages',
      selected: model.priors.map((t, ci) => ci === c ? [1] : [0]),
      title: titleFn
    })
  })

  if (cellResult) {
    // A unknown cell is selected. Show how we predict its value.

    innerHTML += template({
      contextHtml: renderWay(cellResult.context, {
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
