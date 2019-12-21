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
    initialModel = JSON.parse(storedModelJson)
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
      const maybeElem = createElemFn(model, dispatch)
      if (maybeElem) {
        container.appendChild(maybeElem)
      }
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
