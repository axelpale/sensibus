const template = require('./template.ejs')

module.exports = (state, local, dispatch) => {
  const root = document.createElement('div')

  root.innerHTML = template({
    currentFieldLength: local.fieldLength,
    currentFieldOffset: local.fieldOffset,
    currentWeightFactor: local.weightFactor,
    fieldLengths: [1, 2, 3, 5, 7, 9],
    fieldOffsets: [0, -1, -2, -3, -4, -5],
    weightFactors: [0.1, 0.2, 0.33, 0.5, 0.66, 0.8, 1]
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

  root.querySelector('#weight-factor').addEventListener('change', (ev) => {
    dispatch({
      type: 'SELECT_WEIGHT_FACTOR',
      factor: parseFloat(ev.target.value)
    })
  })

  return root
}
