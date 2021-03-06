const template = require('./template.ejs')

module.exports = (state, model, dispatch) => {
  const root = document.createElement('div')

  root.innerHTML = template({
    currentFieldLength: model.fieldLength,
    currentFieldOffset: model.fieldOffset,
    fieldLengths: [1, 2, 3, 5, 7, 9],
    fieldOffsets: [0, -1, -2, -3, -4, -5]
  })

  root.querySelector('#field-length').addEventListener('change', (ev) => {
    dispatch({
      type: 'SELECT_FIELD_LENGTH',
      length: parseInt(ev.target.value)
    })
  })

  root.querySelector('#field-offset').addEventListener('change', (ev) => {
    dispatch({
      type: 'SELECT_FIELD_OFFSET',
      offset: parseInt(ev.target.value)
    })
  })

  return root
}
