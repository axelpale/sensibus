const template = require('./template.ejs')

module.exports = (state, model, dispatch) => {
  const root = document.createElement('div')

  root.innerHTML = template({
    currentFieldLength: model.fieldLength,
    fieldLengths: [1, 2, 5, 8, 13, 21, 34, 55, 89]
  })

  root.querySelector('#field-length').addEventListener('change', (ev) => {
    dispatch({
      type: 'SELECT_FIELD_LENGTH',
      length: parseInt(ev.target.value)
    })
  })

  return root
}
