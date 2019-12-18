const way = require('senseway')
const renderControls = require('./controls/render')
const renderWay = require('../../../lib/renderWay')
const channelTitle = require('../../../lib/channelTitle')

module.exports = (state, model, dispatch) => {
  const root = document.createElement('div')

  // Controls
  root.appendChild(renderControls(state, model, dispatch))

  // Inspection

  const sumEl = document.createElement('div')
  model.fields.forEach((field, c) => {
    const sumField = field.sumField
    const selected = way.set(way.fill(sumField, 0), c, -model.fieldOffset, 1)

    sumEl.appendChild(renderWay(sumField, {
      reversed: true,
      heading: 'Sum by ' + channelTitle(state, c),
      caption: '',
      normalize: true,
      selected: selected
    }))
  })
  root.appendChild(sumEl)

  const sumAbsEl = document.createElement('div')
  model.fields.forEach((field, c) => {
    const sumAbsField = field.sumAbsField
    const selected = way.set(way.fill(sumAbsField, 0), c, -model.fieldOffset, 1)

    sumAbsEl.appendChild(renderWay(sumAbsField, {
      reversed: true,
      heading: 'SumAbs by ' + channelTitle(state, c),
      caption: '',
      normalize: true,
      selected: selected
    }))
  })
  root.appendChild(sumAbsEl)

  const valueEl = document.createElement('div')
  model.fields.forEach((field, c) => {
    const valueField = field.valueField
    const selected = way.set(way.fill(valueField, 0), c, -model.fieldOffset, 1)

    valueEl.appendChild(renderWay(valueField, {
      reversed: true,
      heading: 'Value by ' + channelTitle(state, c),
      caption: '',
      normalize: true,
      selected: selected
    }))
  })
  root.appendChild(valueEl)

  return root
}
