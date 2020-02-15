/* eslint-env worker */

onmessage = (ev) => {
  console.log('Worker received: ' + ev.data)

  setTimeout(() => {
    postMessage(ev.data + 'world')
  }, 1000)
}
