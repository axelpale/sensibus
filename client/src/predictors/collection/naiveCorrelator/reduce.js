const train = require('./train')
const inferAll = require('./inferAll')
const way = require('senseway')

module.exports = (model, memory, ev) => {
  // Compute prediction
  // TODO do not do at every event
  // Default
  if (!model) {
    model = {
      fieldLength: 5,
      fieldOffset: -3,
      fields: [],
      prediction: way.fill(memory, 0)
    }
  }

  switch (ev.type) {
    case 'SELECT_FIELD_LENGTH':
      model = Object.assign({}, model, {
        fieldLength: ev.length
      })
      model = Object.assign({}, model, train(model, memory))
      return Object.assign({}, model, inferAll(model, memory))

    case 'SELECT_FIELD_OFFSET':
      model = Object.assign({}, model, {
        fieldOffset: ev.offset
      })
      model = Object.assign({}, model, train(model, memory))
      return Object.assign({}, model, inferAll(model, memory))

    default:
      return model
  }
}
