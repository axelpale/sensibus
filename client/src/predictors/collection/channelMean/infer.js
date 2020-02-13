module.exports = (model, cell, memory) => {
  return {
    cell: cell,
    prediction: model.channelMeans[cell.channel]
  }
}
