require('./style.css')
const navbar = require('./navbar/render')
const timeline = require('./timeline/render')
const predictors = require('./predictors/render')
const performance = require('./performance/render')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('root')
  root.appendChild(timeline(state, dispatch))

  if (state.sidebar) {
    const sidebar = document.createElement('div')
    sidebar.classList.add('sidebar')
    sidebar.appendChild(navbar(state, dispatch))

    const container = document.createElement('div')
    container.classList.add('container-fluid')
    container.appendChild(predictors(state, dispatch))
    container.appendChild(performance(state, dispatch))
    sidebar.appendChild(container)

    root.appendChild(sidebar)
  } else {
    const opener = document.createElement('div')
    opener.classList.add('sidebar-opener')
    opener.classList.add('bg-dark')
    const openerIcon = document.createElement('img')
    openerIcon.src = 'img/icon.png'
    openerIcon.width = 30
    openerIcon.height = 30
    opener.appendChild(openerIcon)
    root.appendChild(opener)

    opener.addEventListener('click', ev => {
      dispatch({
        type: 'OPEN_SIDEBAR'
      })
    })
  }

  return root
}
