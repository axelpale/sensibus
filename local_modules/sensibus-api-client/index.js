const axios = require('axios')
const baseUrl = '/api'

exports.getRecentTimelines = () => {
  const promise = axios.get(`${baseUrl}/timeline?sort=recent`)
  return promise.then(response => response.data)
}

exports.getPopularTimelines = () => {
  const promise = axios.get(`${baseUrl}/timeline?sort=popular`)
  return promise.then(response => response.data)
}

exports.postAccount = (accountDetails) => {
  const promise = axios.post(`${baseUrl}/account/`, accountDetails)
  return promise.then(response => response.data)
}
