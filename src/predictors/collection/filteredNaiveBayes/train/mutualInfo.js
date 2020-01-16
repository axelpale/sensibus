const divergence = require('divergence')

module.exports = (px, py, pxgy, pxgny) => {
  // Mutual Information I(X;Y)
  return py * divergence(pxgy, px) + (1 - py) * divergence(pxgny, px)
}
