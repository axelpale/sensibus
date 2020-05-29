import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import SignUpForm from '../Form/SignUp.jsx'
import sensibusToken from 'sensibus-token'
import LoginForm from '../Form/Login.jsx'

const LoginBar = ({}) => {
  // states:
  // 0 - show loginbutton
  // 1 - show loginform
  // 2 - show when waiting for response
  // 3 - show when error (timeout/button to state 0)
  // 4 - show logged in details

  const ls = {
    SHOW_LOGINBUTTON: 0,
    SHOW_LOGINFORM: 1,
    WAITING_RESPONSE: 2,
    LOGIN_ERROR: 3,
    LOGGED_IN: 4
  }

  const [loginState, setLoginState] = useState(0)
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({})

  // at the start watch if token is in local storage
  useEffect(() => {
    checkIfLoggedIn()
  }, [])

  // TODO: think
  const checkIfLoggedIn = () => {
    if (sensibusToken.hasToken()) {
      setLoggedInUserDetails(sensibusToken.getDecoded())
      setLoginState(ls.LOGGED_IN)
    }
  }

  const onClickShowLogin = e => {
    e.preventDefault()
    setLoginState(ls.SHOW_LOGINFORM)
  }

  const onClickLogout = () => {
    // remove token from local storage
    sensibusToken.removeToken()
    setLoginState(ls.SHOW_LOGINBUTTON)
  }

  const renderLoginForm = state => {
    if (state == ls.SHOW_LOGINBUTTON) {
      return (
        <>
          <Button variant='outline-info' onClick={onClickShowLogin}>
            Log In
          </Button>
          <SignUpForm />
        </>
      )
    } else if (state == ls.SHOW_LOGINFORM) {
      return (
        <LoginForm
          setLoginState={setLoginState}
          checkIfLoggedIn={checkIfLoggedIn}
          ls={ls}
        />
      )
    } else if (state == ls.WAITING_RESPONSE) {
      return <Navbar.Text>Logging in...</Navbar.Text>
    } else if (state == ls.LOGIN_ERROR) {
      return (
        <Navbar.Text>
          Error{' '}
          <Button variant='outline-info' onClick={() => setLoginState(0)}>
            X
          </Button>
        </Navbar.Text>
      )
    } else if (state == ls.LOGGED_IN) {
      return (
        <Navbar.Text>
          <a href={`/user/${loggedInUserDetails.name}`}>
            {loggedInUserDetails.email}
          </a>{' '}
          <Button variant='outline-info' onClick={onClickLogout}>
            Logout
          </Button>
        </Navbar.Text>
      )
    }
  }

  return (
    <Navbar bg='dark' variant='dark'>
      <Navbar.Collapse className='justify-content-end'>
        {renderLoginForm(loginState)}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default LoginBar
