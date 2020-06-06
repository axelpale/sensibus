const loginReducer = (state = false, action) => {
  // redux reducer for login state
  switch (action.type) {
    case 'LOGIN':
      return true
    case 'LOGOUT':
      return false
    default:
      return state
  }
}

export const login = () => {
  return { type: 'LOGIN' }
}

export const logout = () => {
  return { type: 'LOGOUT' }
}

export default loginReducer
