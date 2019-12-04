
module.exports = (model, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('row')
  root.classList.add('how-title')

  const h = document.createElement('h2')
  h.innerHTML = 'How this prediction was made'
  root.appendChild(h)

  const b = document.createElement('input')
  b.type = 'button'
  b.value = model.how ? 'Hide' : 'Show'
  root.appendChild(b)

  b.addEventListener('click', ev => {
    dispatch({
      type: 'HOW_ONOFF'
    })
  })

  return root
};
