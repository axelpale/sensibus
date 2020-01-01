module.exports = (local) => {
  return {
    channels: local.channels,
    frames: local.frames,
    select: local.select,
    cellEditDirection: local.cellEditDirection,
    version: 1,
    memory: local.memory,
    breaks: local.breaks
  }
}
