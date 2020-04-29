module.exports = (model, memory, ev) => {
  // Compute prediction
  // TODO do not do at every event
  // Default
  if (!model) {
    model = {
      fieldLength: 5,
      fieldOffset: -3,
      fields: []
    }
  }

  switch (ev.type) {
    case 'SELECT_FIELD_LENGTH':
      return Object.assign({}, model, {
        fieldLength: ev.length
      })

    case 'SELECT_FIELD_OFFSET':
      return Object.assign({}, model, {
        fieldOffset: ev.offset
      })

    default:
      return model
  }
}
