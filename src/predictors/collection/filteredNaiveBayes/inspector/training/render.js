const headingTemplate = require('./heading.ejs')
const contentTemplate = require('./content.ejs')
const filteringTemplate = require('./filtering.ejs')
const way = require('senseway')
const renderWay = require('../renderWay')
const problib = require('problib')

const gain = (priors, posterior) => {
  return way.map(posterior, (pos, c, t) => {
    const pri = priors[c]
    // Kullback-Leibler divergence
    return problib.divergence(pos, pri)
  })
}

module.exports = (state, model, dispatch) => {
  const root = document.createElement('div')

  const showMore = model.trainingInsights
  const heading = document.createElement('div')

  heading.innerHTML = headingTemplate({
    showMore: showMore
  })

  heading.querySelector('.show-moreless').addEventListener('click', ev => {
    ev.preventDefault()
    dispatch({
      type: 'TOGGLE_TRAINING_INSIGHTS',
      toggleTo: !showMore
    })
  })

  root.appendChild(heading)

  if (!showMore) {
    return root
  }

  // Show more

  const c = model.inspectorChannel ? model.inspectorChannel : 0
  const channelTitle = state.timeline.channels[c].title
  const emptyField = way.fill(model.fields[0]['1'].prob, 0)
  const fieldOffset = model.fieldLength - 1
  const selected = way.set(emptyField, c, fieldOffset, 1)

  const titleFn = (q, ci, ti) => {
    const chTitle = state.timeline.channels[ci].title
    return q.toFixed(2) + ' ' + chTitle
  }

  const priors = model.priors
  const posField = model.fields[c]['1'].prob
  const negField = model.fields[c]['-1'].prob
  const posGain = way.set(gain(priors, posField), c, fieldOffset, 0)
  const negGain = way.set(gain(priors, negField), c, fieldOffset, 0)
  const posDiff = way.map(posField, (p, c, t) => {
    return p - priors[c]
  })
  const negDiff = way.map(negField, (p, c, t) => {
    return p - priors[c]
  })

  const content = document.createElement('div')
  content.innerHTML = contentTemplate({
    channels: state.timeline.channels,
    selectedChannel: c,
    priors: renderWay(model.priors.map(t => [t]), {
      heading: 'Channel averages',
      selected: model.priors.map((t, ci) => ci === c ? [1] : [0]),
      title: titleFn
    }),
    posField: renderWay(posField, {
      heading: 'If ' + channelTitle + ' then',
      caption: 'in average.',
      selected: selected,
      title: titleFn
    }),
    negField: renderWay(negField, {
      heading: 'If not ' + channelTitle + ' then',
      caption: 'in average.',
      selected: selected,
      title: titleFn
    }),
    posDiff: renderWay(posDiff, {
      heading: 'Difference to channel average around ' + channelTitle,
      selected: selected,
      title: titleFn
    }),
    negDiff: renderWay(negDiff, {
      heading: 'Difference to channel average around not ' + channelTitle,
      selected: selected,
      title: titleFn
    }),
    posGain: renderWay(posGain, {
      heading: 'Dependent on ' + channelTitle,
      caption: 'by KL-divergence.',
      selected: selected,
      title: titleFn
    }),
    negGain: renderWay(negGain, {
      heading: 'Dependent on not ' + channelTitle,
      caption: 'by KL-divergence.',
      selected: selected,
      title: titleFn
    })
  })

  const chanSelector = content.querySelector('#training-channel-selector')
  chanSelector.addEventListener('change', (ev) => {
    dispatch({
      type: 'SELECT_INSPECTOR_CHANNEL',
      channel: parseInt(ev.target.value)
    })
  })

  root.appendChild(content)

  // Filtering step

  const filtering = document.createElement('div')
  filtering.innerHTML = filteringTemplate({
    mutualInfo: renderWay(model.mutualInfos[c][0], {
      heading: 'Mutual information with ' + channelTitle,
      selected: selected,
      title: titleFn
    }),
    filterIncrements: model.mrmr[c].increments.map((increment, i) => {
      const best = (model.mrmr[c].bestAt === i)
      return renderWay(increment.subset, {
        heading: 'Subset #' + i + (best ? ' (best)' : ''),
        caption: 'Score ' + increment.score,
        title: titleFn
      })
    }),
    weight: renderWay(model.weights[c], {
      heading: 'Filtered Weights'
    })
  })

  root.appendChild(filtering)

  return root
}