
exports.divergence = (pxgy, px) => {
  // Kullback-Leibler divergence Dkl(Pxgy||Px)
  const pos = pxgy === 0 ? 0 : pxgy * Math.log2(pxgy / px)
  const neg = pxgy === 1 ? 0 : (1 - pxgy) * Math.log2((1 - pxgy) / (1 - px))
  return pos + neg
}

exports.mutualInfo = (px, py, pxgy, pxgny) => {
  // Mutual Information I(X;Y)
  // Example: Two adjacent values in flip-flop sequence.
  //   px=0.5, py=0.5, pxgy=0.0, pxgny=1.0
  const pos = py * exports.divergence(pxgy, px)
  const neg = (1 - py) * exports.divergence(pxgny, px)
  return pos + neg
}
