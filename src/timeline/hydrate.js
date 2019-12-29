module.exports = (local) => {
  return {
    channels: local.channels,
    frames: local.frames,
    channelOnEdit: null,
    frameOnEdit: null,
    select: null,
    version: 1,
    memory: local.memory
  }
}
