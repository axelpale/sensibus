// See https://stackoverflow.com/a/18197341/638546

module.exports = (filename, text) => {
  const element = document.createElement('a')
  const encoded = encodeURIComponent(text)
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encoded)
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}
