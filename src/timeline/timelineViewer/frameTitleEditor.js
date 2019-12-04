
module.exports = (model, dispatch) => {
  const form = document.createElement('form');

  const t = model.frameOnEdit;
  const title = model.frames[t].title;

  const text = document.createElement('input');
  text.type = 'text';
  text.value = title;
  form.appendChild(text);

  const okBtn = document.createElement('button');
  okBtn.type = 'button';
  okBtn.innerHTML = 'OK';
  form.appendChild(okBtn);

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.innerHTML = 'DEL';
  form.appendChild(delBtn);

  const upBtn = document.createElement('button');
  upBtn.type = 'button';
  upBtn.innerHTML = 'Move up';
  form.appendChild(upBtn);

  const downBtn = document.createElement('button');
  downBtn.type = 'button';
  downBtn.innerHTML = 'Move down';
  form.appendChild(downBtn);

  // Events

  setTimeout(() => {
    text.focus();
  }, 200);

  form.addEventListener('submit', ev => {
    ev.preventDefault();
    dispatch({
      type: 'EDIT_FRAME_TITLE',
      time: t,
      title: text.value
    });
  });

  okBtn.addEventListener('click', ev => {
    dispatch({
      type: 'EDIT_FRAME_TITLE',
      time: t,
      title: text.value
    });
  });

  delBtn.addEventListener('click', ev => {
    dispatch({
      type: 'REMOVE_FRAME',
      time: t
    });
  });

  upBtn.addEventListener('click', ev => {
    dispatch({
      type: 'MOVE_FRAME',
      time: t,
      offset: 1
    });
  });

  downBtn.addEventListener('click', ev => {
    dispatch({
      type: 'MOVE_FRAME',
      time: t,
      offset: -1
    });
  });

  return form;
}
