const deepEqual = require('deep-equal')

const clearElem = (el) => {
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }
  return el
}

module.exports = (opts) => {
  // Persistence
  let initialModel
  const storedModelJson = window.localStorage.getItem(opts.storageName)
  if (storedModelJson) {
    const storedModel = JSON.parse(storedModelJson)
    if (deepEqual(storedModel.defaultModel, opts.defaultModel, { strict: true })) {
      initialModel = storedModel
    } else {
      // Default model changed due to a source update.
      // Replace the old values with new data. Keep unchanged data.
      initialModel = Object.assign({}, storedModel, opts.defaultModel, {
        defaultModel: opts.defaultModel
      })
    }
  } else {
    initialModel = opts.defaultModel
  }

  const reducer = (model, ev) => {
    return opts.reducers.reduce((acc, re) => re(acc, ev), model)
  }

  let currentModel = initialModel

  const dispatch = (ev) => {
    const newModel = reducer(currentModel, ev)
    render(newModel)
    store(newModel)
    currentModel = newModel
  }

  const render = (model) => {
    const container = document.getElementById(opts.rootElementId)
    clearElem(container)

    opts.renderers.forEach(createElemFn => {
      container.appendChild(createElemFn(model, dispatch))
    })
  }

  const store = (model) => {
    const modelJson = JSON.stringify(model)
    window.localStorage.setItem(opts.storageName, modelJson)
  }

  // This allows reducers to fill in missing properties.
  // Also triggers the first render.
  dispatch({
    type: '__INIT__'
  })
}
