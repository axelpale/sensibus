
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

exports.precision = (confusion) => {
  if (confusion.truePos + confusion.falsePos > 0) {
    return confusion.truePos / (confusion.truePos + confusion.falsePos)
  }
  return 0
}

exports.recall = (confusion) => {
  if (confusion.truePos + confusion.falseNeg > 0) {
    return confusion.truePos / (confusion.truePos + confusion.falseNeg)
  }
  return 0
}

exports.accuracy = (confusion) => {
  const co = confusion
  const n = co.truePos + co.trueNeg + co.falsePos + co.falseNeg
  if (n > 0) {
    return (co.truePos + co.trueNeg) / n
  }
  return 0
}

exports.f1score = (confusion) => {
  const precision = exports.precision(confusion)
  const recall = exports.recall(confusion)
  if (precision + recall > 0) {
    return 2 * (precision * recall) / (precision + recall)
  }
  return 0
}
