module.exports = (el) => {
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }
  return el
}
