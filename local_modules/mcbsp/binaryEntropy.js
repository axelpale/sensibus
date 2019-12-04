module.exports = (p) => {
  if (p > 0 && p < 1) {
    return -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
  } else {
    return 0;
  }
}
