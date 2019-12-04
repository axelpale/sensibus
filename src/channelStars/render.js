const rowTitle = require('./rowTitle');

module.exports = (model, dispatch) => {
  const root = document.createElement('div');

  const row = document.createElement('div');
  row.classList.add('row');

  row.appendChild(rowTitle(model, dispatch))

  const cells = document.createElement('div');
  cells.classList.add('cells');

  model.timeline.forEach((ch, c) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.classList.add('cell-title');

    if (model.channels[c].star) {
      cell.innerHTML = '<div class="cell-text">&starf;</div>';
    }

    cell.addEventListener('click', ev => {
      dispatch({
        type: 'STAR_CHANNEL',
        channel: c
      });
    });

    cells.appendChild(cell);
  });

  row.appendChild(cells);
  root.appendChild(row);

  return root;
}
