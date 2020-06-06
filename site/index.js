import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import { createStore } from 'redux'

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

const store = createStore(loginReducer)

const renderApp = () =>
  ReactDOM.render(<App store={store} />, document.querySelector('#root'))

renderApp()
store.subscribe(renderApp)
