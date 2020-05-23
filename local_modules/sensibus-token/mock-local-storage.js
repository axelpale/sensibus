// Mock localStorage
global.window = {}

global.window.localStorage = {
  data: {},
  getItem: function (key) {
    const val = this.data[key]
    if (val) {
      return val
    }
    return null
  },
  setItem: function (key, value) {
    this.data[key] = value
  },
  removeItem: function (key) {
    delete this.data[key]
  }
}
