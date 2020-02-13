const template = require('./template.ejs')

module.exports = (state, dispatch) => {
  const root = document.createElement('div')
  root.innerHTML = template(state.performance)

  root.querySelector('button').addEventListener('click', ev => {
    dispatch({
      type: 'RUN_PERFORMANCE_TEST'
    })
  })

  return root.firstChild
}
