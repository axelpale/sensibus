import axios from 'axios'
const baseUrl = '/api'

const getRecentTimelines = () => {
  const promise = axios.get(`${baseUrl}/timeline?sort=recent`)
  return promise.then(response => response.data)
}

const getPopularTimelines = () => {
  const promise = axios.get(`${baseUrl}/timeline?sort=popular`)
  return promise.then(response => response.data)
}

const postAccount = () => {
  const promise = axios.post(`${baseUrl}/account/`)
  return promise.then(response => response.data)
}

export default { getRecentTimelines, getPopularTimelines, postAccount }
