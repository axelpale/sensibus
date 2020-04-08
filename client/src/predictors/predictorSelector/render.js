const collection = require('../collection')

exports.create = (store, dispatch) => {
  const state = store.getState()
  const control = document.createElement('div')
  control.classList.add('predictor-selector')

  const label = document.createElement('label')
  label.classList.add('frame-label')
  label.for = 'predictor'
  label.innerHTML = 'Prediction method'
  label.style = 'margin-right: 0.2em'
  control.appendChild(label)

  const input = document.createElement('select')
  input.name = 'predictor'

  Object.keys(collection.predictors).forEach(key => {
    const opt = document.createElement('option')
    opt.value = key
    opt.innerHTML = key
    if (state.predictors.currentId === key) {
      opt.selected = 'selected'
    }
    input.appendChild(opt)
  })

  control.appendChild(input)

  input.addEventListener('change', (ev) => {
    dispatch({
      type: 'SELECT_PREDICTOR',
      key: ev.target.value
    })
  })

  return control
}
