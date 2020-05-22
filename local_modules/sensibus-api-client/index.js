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

exports.postTimeline = () => {
  const promise = axios.post(`${baseUrl}/timeline/`)
  return promise.then(response => response.data)
}

exports.postAccount = accountDetails => {
  const promise = axios.post(`${baseUrl}/account/signup`, accountDetails)
  return promise.then(response => response.data)
}

exports.getUser = userId => {
  const promise = axios.get(`${baseUrl}/user/${userId}`)
  return promise.then(response => response.data)
}

exports.postLogin = credentials => {
  const promise = axios.post(`${baseUrl}/account/login`, credentials)
  return promise.then(response => response.data)
}
