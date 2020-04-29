// A simplifying factory for those predictors that train synchronously i.e.
// are busy until finished. Advanced predictors train in async.

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
