import axios from 'axios'
const baseUrl = '/api/timeline'

const getRecentTimelines = () => {
  const promise = axios.get(`${baseUrl}?sort=recent`)
  return promise.then(response => response.data)
}

const getPopularTimelines = () => {
  const promise = axios.get(`${baseUrl}?sort=popular`)
  return promise.then(response => response.data)
}

export default { getRecentTimelines, getPopularTimelines }
