module.exports = (pxgy, px) => {
  // Kullback-Leibler divergence Dkl(Pxgy||Px)
  const pos = pxgy * Math.log2(pxgy / px)
  const neg = (1 - pxgy) * Math.log2((1 - pxgy) / (1 - px))
  return pos + neg
}
