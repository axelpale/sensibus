const way = require('senseway')
const renderWay = require('../../../lib/renderWay')
const channelTitle = require('../../../lib/channelTitle')

module.exports = (state, dispatch) => {
  const local = state.predictors.firstOrder // TODO no literal names
  const root = document.createElement('div')

  const sumEl = document.createElement('div')
  local.fields.forEach((field, c) => {
    const sumField = field.sumField
    const selected = way.set(way.fill(sumField, 0), c, -local.fieldOffset, 1)

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
  local.fields.forEach((field, c) => {
    const sumAbsField = field.sumAbsField
    const selected = way.set(way.fill(sumAbsField, 0), c, -local.fieldOffset, 1)

    sumAbsEl.appendChild(renderWay(sumAbsField, {
      reversed: true,
      heading: 'SumAbs by ' + channelTitle(state, c),
      caption: '',
      normalize: true,
      selected: selected
    }))
  })
  root.appendChild(sumAbsEl)

  // const varEl = document.createElement('div')
  // local.variances.forEach((sup, c) => {
  //   varEl.appendChild(renderWay(sup, {
  //     reversed: true,
  //     heading: 'Variance for ' + channelTitle(state, c),
  //     caption: '',
  //     normalize: true
  //   }))
  // })
  // root.appendChild(varEl)
  //
  // const devEl = document.createElement('div')
  // local.deviationFields.forEach((dev, c) => {
  //   devEl.appendChild(renderWay(dev, {
  //     reversed: true,
  //     heading: 'Deviation for ' + channelTitle(state, c),
  //     caption: '',
  //     normalize: true
  //   }))
  // })
  // root.appendChild(devEl)

  return root
}
