exports.color = (state, channel) => {
  const c = channel
  const N = state.timeline.channels.length
  const hue = '' + (360 * (1 - c / N))
  const sat = '100'
  const lig = '40'
  const hsl = 'hsl(' + hue + ',' + sat + '%,' + lig + '%)'
  return hsl
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
