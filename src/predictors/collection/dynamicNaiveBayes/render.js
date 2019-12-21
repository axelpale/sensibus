// const way = require('senseway')
const renderControls = require('./controls/render')
const cellInspector = require('./cellInspector/render')
// const renderWay = require('../../../lib/renderWay')
// const channelTitle = require('../../../lib/channelTitle')

module.exports = (state, local, dispatch) => {
  const root = document.createElement('div')

  // Selection related data
  root.appendChild(cellInspector(state, local, dispatch))

  // Controls
  root.appendChild(renderControls(state, local, dispatch))

  // Inspection

  // const posEl = document.createElement('div')
  // local.fields.forEach((field, c) => {
  //   const posField = field.posField
  //   const selected = way.set(way.fill(posField, 0), c, -local.fieldOffset, 1)
  //
  //   posEl.appendChild(renderWay(posField, {
  //     reversed: true,
  //     heading: 'P(1|1) on ' + channelTitle(state, c),
  //     caption: '',
  //     normalize: true,
  //     selected: selected
  //   }))
  // })
  // root.appendChild(posEl)
  //
  // const negEl = document.createElement('div')
  // local.fields.forEach((field, c) => {
  //   const negField = field.negField
  //   const selected = way.set(way.fill(negField, 0), c, -local.fieldOffset, 1)
  //
  //   negEl.appendChild(renderWay(negField, {
  //     reversed: true,
  //     heading: 'P(1|-1) on ' + channelTitle(state, c),
  //     caption: '',
  //     normalize: true,
  //     selected: selected
  //   }))
  // })
  // root.appendChild(negEl)

  return root
}
