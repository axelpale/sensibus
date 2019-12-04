const predict = require('../lib/predict');
const way = require('senseway')

module.exports = (model, dispatch) => {
  const root = document.createElement('div');

  if (model.select === null) {
    return root;
  }

  const c = model.select.channel;
  const t = model.select.time;
  const pred = predict(model, c, t);

  const row = document.createElement('div');

  let html = ''
  html += 'Channel ' + c + ': ' + model.channels[c].title + '<br>'
  html += 'Frame ' + t + ': ' + model.frames[t].title + '<br>'
  html += 'Probability: ' + pred.prob.toFixed(2) + '<br>'
  html += 'Channel Mean: ' + pred.priorProb.toFixed(2) + '<br>'

  const renderSupport = (ctxMean, ctxGain) => {
    let str = ''
    const cells = way.toArray(ctxGain.value).map(cell => {
      cell.gain = cell.value
      cell.mass = ctxGain.mass[cell.channel][cell.time]
      cell.mean = ctxMean.value[cell.channel][cell.time]
      cell.weight = cell.gain * Math.sqrt(cell.mass)
      return cell
    })
    cells.sort((a, b) => b.weight - a.weight)
    cells.forEach(cell => {
      const chTitle = model.channels[cell.channel].title
      str += chTitle + ' '
      str += 't' + cell.time + ' '
      str += 'a' + cell.mean.toFixed(3) + ' '
      str += 'g' + cell.value.toFixed(3) + ' '
      str += 'm' + cell.mass.toFixed(3) + ' '
      str += 'w' + cell.weight.toFixed(3) + '<br>'
    })
    return str
  }

  const ctxMean = (pred.prob < 0.5) ? pred.zeroMean : pred.oneMean;
  const ctxGain = (pred.prob < 0.5) ? pred.zeroGain : pred.oneGain;

  html += '<strong>0 supported by:</strong><br>'
  html += renderSupport(pred.zeroMean, pred.zeroGain)
  html += '<strong>1 supported by:</strong><br>'
  html += renderSupport(pred.oneMean, pred.oneGain)

  row.innerHTML = html;

  root.appendChild(row);

  // Events

  return root;
}
