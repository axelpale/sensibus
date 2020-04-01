// A simplifying factory for those predictors that train synchronously.

module.exports = (train) => {
  return (config, memory, onprogress, onfinish) => {
    const timeoutId = setTimeout(() => {
      const model = train(config, memory)

      onprogress({
        progress: 1.0
      })

      onfinish(null, model)
    }, 0)

    return () => {
      // Cancel immediately
      clearTimeout(timeoutId)
    }
  }
}
