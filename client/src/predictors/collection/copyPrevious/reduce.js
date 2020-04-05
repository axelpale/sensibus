module.exports = (model, memory, ev) => {
  // Compute prediction
  // TODO do not do at every event
  if (!model) {
    model = {}
  }

  switch (ev.type) {
    default:
      return model
  }
}
