const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {
  const tline = wayElem(model.timeline, {
    reversed: true,
    heading: 'Frames',
    caption: '...or frames. Each frame represents a moment in time.'
  })

  // Allow special margin to reveal channels.
  tline.classList.add('how-frames')

  return tline
}
