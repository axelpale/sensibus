const way = require('senseway')
const howTitle = require('./howTitle/render')
const howChannels = require('./howChannels/render')
const howEventSelector = require('./howEventSelector/render')
const howFrames = require('./howFrames/render')
const howSelected = require('./howSelected/render')
const howContextMask = require('./howContextMask/render')
const howContext = require('./howContext/render')
const howPrior = require('./howPrior/render')
const howPriorPrediction = require('./howPriorPrediction/render')
const howContextMean0 = require('./howContextMean0/render')
const howContextMean1 = require('./howContextMean1/render')
const howPrediction = require('./howPrediction/render')
const wayel = require('../lib/wayElem')

module.exports = (model, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('how-container')

  root.appendChild(howTitle(model, dispatch))

  if (!model.how) {
    return root
  }

  const timeline = document.createElement('div')
  timeline.classList.add('how-timeline')

  timeline.appendChild(wayel(model.timeline, {
    reversed: true,
    heading: 'Timeline',
    caption: 'Here is the timeline - our training data set. '
      + 'Black represents an activity happening. White represents '
      + 'an activity not happening. They both we call <em>atomic events</em>.'
  }))

  timeline.appendChild(howChannels(model, dispatch))
  timeline.appendChild(howFrames(model, dispatch))

  const timelineMass = way.map(model.timeline, q => q === null ? 0 : 1)
  timeline.appendChild(wayel(timelineMass, {
    reversed: true,
    heading: 'Timeline Mass',
    caption: 'Mass shows which atomic events we know and which we '
      + 'do not know. Here are masses for each. White = 0, Black = 1.'
  }))

  const unknownEvents = way.map(timelineMass, q => 1 - q)
  timeline.appendChild(wayel(unknownEvents, {
    reversed: true,
    heading: 'Unknown Data',
    caption: 'These atomic events we do not know. Our goal is to predict '
      + 'their value from the training data.'
  }))

  timeline.appendChild(howEventSelector(model, dispatch))
  timeline.appendChild(howSelected(model, dispatch))
  timeline.appendChild(howContextMask(model, dispatch))
  timeline.appendChild(howContext(model, dispatch))
  timeline.appendChild(howPrior(model, dispatch))
  timeline.appendChild(howPriorPrediction(model, dispatch))
  timeline.appendChild(howContextMean0(model, dispatch))
  timeline.appendChild(howContextMean1(model, dispatch))
  timeline.appendChild(howPrediction(model, dispatch))

  root.appendChild(timeline)

  return root
}
