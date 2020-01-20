const template = require('./template.ejs')

module.exports = (state, model, dispatch) => {
  const root = document.createElement('div')

  root.innerHTML = template({
    currentFieldLength: model.fieldLength,
    fieldLengths: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  })

  root.querySelector('#field-length').addEventListener('change', (ev) => {
    dispatch({
      type: 'SELECT_FIELD_LENGTH',
      length: parseInt(ev.target.value)
    })
  })

  return root
}
