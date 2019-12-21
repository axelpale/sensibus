const navbar = require('./navbar/render')
const timeline = require('./timeline/render')
const predictors = require('./predictors/render')
const performance = require('./performance/render')

module.exports = (state, dispatch) => {
  navbar(state, dispatch)

  const root = document.createElement('div')
  root.classList.add('row')

  const mainCol = document.createElement('div')

  if (state.sidebar) {
    const sideCol = document.createElement('div')
    mainCol.classList.add('col-8')
    mainCol.appendChild(timeline(state, dispatch))
    root.appendChild(mainCol)
    sideCol.classList.add('col-4')
    sideCol.appendChild(predictors(state, dispatch))
    sideCol.appendChild(performance(state, dispatch))
    root.appendChild(sideCol)
  } else {
    mainCol.classList.add('col')
    mainCol.appendChild(timeline(state, dispatch))
    root.appendChild(mainCol)
  }

  return root
}
