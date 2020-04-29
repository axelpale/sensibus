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

const postAccount = (accountDetails) => {
  const promise = axios.post(`${baseUrl}/account/`, accountDetails)
  return promise.then(response => response.data)
}

export default { getRecentTimelines, getPopularTimelines, postAccount }
