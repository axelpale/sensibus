exports.color = (state, channel) => {
  const c = channel
  const N = state.timeline.channels.length
  const hue = '' + (360 * (1 - c / N))
  const sat = '100'
  const lig = '40'
  const hsl = 'hsl(' + hue + ',' + sat + '%,' + lig + '%)'
  return hsl
}

const sunset = ['F8B195', 'F67280', 'C06C84', '6C5B7B', '355C7D']
exports.colorSunset = (state, channel) => {
  return '#' + sunset[channel % sunset.length]
}

exports.probToCircleRadius = (prob) => {
  // Return 0..1 as the radius of a unit circle.
  //
  // Area of an unit circle.
  // unitArea = PI * r1 * r1 = PI * 1 * 1 = PI
  // probArea = prob * PI
  //
  // probArea = PI * r * r
  // => r = sqrt(probArea / PI)
  // => r = sqrt(prob * PI / PI)
  // => r = sqrt(prob)
  return Math.sqrt(prob)
}
