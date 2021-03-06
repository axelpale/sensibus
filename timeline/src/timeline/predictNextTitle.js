module.exports = title => {
  // Take in string. Map it to another.
  // Return string
  //
  if (title === '') {
    return ''
  }

  if (!Number.isNaN(parseInt(title))) {
    const nextInt = parseInt(title) + 1
    return '' + nextInt
  }

  const fiDate = /(ma|ti|ke|to|pe|la|su)\s(\d+)\.(\d+)\.?/i
  const fiDateFound = title.match(fiDate) // null if not found
  if (fiDateFound) {
    const labels = ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su']
    const foundLabel = fiDateFound[1]
    const labelIndex = labels.indexOf(foundLabel)
    const nextIndex = (labelIndex + 1) % labels.length
    const nextLabel = labels[nextIndex]

    const day = parseInt(fiDateFound[2])
    const month = parseInt(fiDateFound[3])

    const currentYear = (new Date()).getFullYear()
    const newDate = new Date(currentYear, month - 1, day + 1)
    // Note Date-object monthIndex is 0..11 but day is 1..31. Of course.

    const newDay = newDate.getDate()
    const newMonth = newDate.getMonth() + 1

    return nextLabel + ' ' + newDay + '.' + newMonth + '.'
  }

  return ''
}
