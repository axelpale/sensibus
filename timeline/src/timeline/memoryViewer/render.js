const frameEditor = require('../frameTitles/frameEditorRow')
const renderRow = require('./row')
const way = require('senseway')
const ui = require('uilib')

const getElementsByClass = ui.getElementsByClass
const removeClass = cl => el => el.classList.remove(cl)
const removeEl = el => el.parentNode.removeChild(el)
const removeClassByClass = cl => getElementsByClass(cl).forEach(removeClass(cl))
const removeElsByClass = cl => getElementsByClass(cl).forEach(removeEl)

exports.create = (store, dispatch) => {
  const timeline = store.getState().timeline
  const select = timeline.select
  const root = document.createElement('div')

  const LEN = way.len(timeline.memory)
  const HIDE_BEFORE = timeline.hideBefore

  for (let t = LEN - 1; t >= HIDE_BEFORE; t -= 1) {
    // Add frame editor before the frame if selected.
    if (select && t === select.frame && select.channel === -1) {
      root.appendChild(frameEditor(store, dispatch, t))
    }
    root.appendChild(renderRow(store, dispatch, t))
  }

  return root
}

exports.updateFrameTitles = (store, dispatch) => {
  const state = store.getState()
  const labels = document.getElementsByClassName('frame-label')
  const titles = state.timeline.frames.map(frame => frame.title)

  // NOTE labels is not Array but array-like.
  for (let i = 0; i < labels.length; i += 1) {
    const frame = parseInt(labels[i].dataset.frame)
    labels[i].innerHTML = titles[frame]
  }
}

exports.updateSelect = (store, dispatch) => {
  // Unstyle the previous channel and frame
  removeClassByClass('cell-selected')
  removeClassByClass('cell-focus')

  // Unstyle the previously selected frame titles
  removeClassByClass('frame-title-selected')
  removeClassByClass('title-channel-selected')

  // Remove possible frame editor
  removeElsByClass('frame-editor-row')

  const select = store.getState().timeline.select
  if (select) {
    // Style the next channel and frame
    const c = select.channel
    const t = select.frame
    const channelClass = 'channel-' + c
    const frameClass = 'frame-' + t

    // Set cells at channel
    if (c >= 0) {
      const cellEls = getElementsByClass(channelClass)
      cellEls.forEach(el => el.classList.add('cell-selected'))
    }

    // Set cells at frame
    if (t >= 0) {
      const cellEls = getElementsByClass(frameClass)
      cellEls.forEach(el => el.classList.add('cell-selected'))
    }

    // Set focus
    if (c >= 0 && t >= 0) {
      const focusClass = channelClass + ' ' + frameClass
      const cellEls = getElementsByClass(focusClass)
      cellEls.forEach(el => el.classList.add('cell-focus'))
    }

    // Add frame editor gefore row when the frame title becomes selected
    if (c === -1 && t >= 0) {
      const editor = frameEditor(store, dispatch, t)
      const frameEls = getElementsByClass('row-frame-' + t) // Single
      frameEls.forEach(el => {
        el.parentNode.insertBefore(editor, el)
      })
    }

    // Style the next frame title
    if (t >= 0) {
      const frameTitleClass = 'frame-title-' + t
      const els = getElementsByClass(frameTitleClass)
      els.forEach(el => el.classList.add('frame-title-selected'))
    }
  }
}
