const jwtDecode = require('jwt-decode')

// Ensure we are in browser space
if (!window.localStorage) {
  throw new Error('Local storage not found. Unable to store JWT token.')
}

// Token's key in the local storage.
const TOKEN_KEY = 'sensibus-auth-token'

// Init token cache at start up.
// NOTE singleton pattern.
let tokenCache = null
{
  const tokenStr = window.localStorage.getItem(TOKEN_KEY)
  if (tokenStr) {
    try {
      tokenCache = jwtDecode(tokenStr)
    } catch (err) {
      // Falsy or malformed token
      tokenCache = null
    }
  } else {
    // No token at all
    tokenCache = null
  }
}

// Fn to check token contents schema
const validate = (obj) => {
  return typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.admin === 'boolean' &&
    typeof obj.email === 'string'
}

exports.getDecoded = () => {
  if (tokenCache === null) {
    return null
  }
  return Object.assign({}, tokenCache)
}

exports.getUser = () => {
  // Return user data from the token. Return null if no token set.
  // Leave out expiration time and others.
  if (tokenCache) {
    return {
      admin: tokenCache.admin,
      email: tokenCache.email,
      id: tokenCache.id,
      name: tokenCache.name
    }
  }
  return null
}

exports.getToken = () => {
  // Return token string or null if no token available.
  return window.localStorage.getItem(TOKEN_KEY)
}

exports.hasToken = () => {
  // Return true if a valid token is set, false otherwise.
  return tokenCache !== null
}

exports.setToken = (jwtString) => {
  // Set token from an encoded JWT string.
  // Throw if falsy or malformed token.
  const candidate = jwtDecode(jwtString) // throws

  if (!validate(candidate)) {
    throw new Error('Token is missing required properties.')
  }

  tokenCache = candidate
  window.localStorage.setItem(TOKEN_KEY, jwtString)
}

exports.removeToken = () => {
  // Remove token and clear cache.
  window.localStorage.removeItem(TOKEN_KEY)
  tokenCache = null
}
