module.exports = (local) => {
  return {
    channels: local.channels,
    frames: local.frames,
    select: local.select,
    cellEditDirection: local.cellEditDirection,
    cellEditPredicted: local.cellEditPredicted,
    version: 1,
    memory: local.memory
  }
}
