const frameTitleEditor = require('./frameTitleEditor');

module.exports = (model, dispatch, time) => {
  const root = document.createElement('div');
  root.classList.add('row-title');

  if (model.frameOnEdit !== time) {
    root.innerHTML = model.frames[time].title;

    root.addEventListener('click', ev => {
      dispatch({
        type: 'OPEN_FRAME_TITLE_EDITOR',
        time: time
      });
    });
  } else {
    // Frame title editor
    root.appendChild(frameTitleEditor(model, dispatch));
  }

  return root;
}
