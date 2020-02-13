module.exports = (sum, sumAbs) => {
  if (sumAbs > 0) {
    return (1 + sum / sumAbs) / 2
  }
  return 0.5
}
