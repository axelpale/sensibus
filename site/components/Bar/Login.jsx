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
      setLoginState(4)
    }
  }

  const onClickShowLogin = e => {
    e.preventDefault()
    setLoginState(1)
  }

  const onClickLogout = () => {
    // remove token from local storage
    sensibusToken.removeToken()
    setLoginState(0)
  }

  const renderLoginForm = state => {
    if (state == 0) {
      return (
        <>
          <Button variant='outline-info' onClick={onClickShowLogin}>
            Log In
          </Button>
          <SignUpForm />
        </>
      )
    } else if (state == 1) {
      return (
        <LoginForm
          setLoginState={setLoginState}
          checkIfLoggedIn={checkIfLoggedIn}
        />
      )
    } else if (state == 2) {
      return <Navbar.Text>Logging in...</Navbar.Text>
    } else if (state == 3) {
      return (
        <Navbar.Text>
          Error{' '}
          <Button variant='outline-info' onClick={() => setLoginState(0)}>
            X
          </Button>
        </Navbar.Text>
      )
    } else if (state == 4) {
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
