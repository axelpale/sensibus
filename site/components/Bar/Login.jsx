import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import SignUpForm from '../Form/SignUp.jsx'
import sensibusToken from 'sensibus-token'
import LoginForm from '../Form/Login.jsx'
import { login, logout } from '../../reducers/loginReducer'
import { useDispatch } from 'react-redux'

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

  const [loginBarState, setLoginBarState] = useState(0)
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({})
  const dispatch = useDispatch()

  // at the start watch if token is in local storage
  useEffect(() => {
    checkIfLoggedIn()
  }, [])

  // TODO: think
  const checkIfLoggedIn = () => {
    if (sensibusToken.hasToken()) {
      setLoggedInUserDetails(sensibusToken.getDecoded())
      setLoginBarState(ls.LOGGED_IN)
      dispatch(login())
    }
  }

  const onClickShowLogin = e => {
    e.preventDefault()
    setLoginBarState(ls.SHOW_LOGINFORM)
  }

  const onClickLogout = () => {
    // remove token from local storage
    sensibusToken.removeToken()
    setLoginBarState(ls.SHOW_LOGINBUTTON)
    dispatch(logout())
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
          setLoginBarState={setLoginBarState}
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
          <Button variant='outline-info' onClick={() => setLoginBarState(0)}>
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
      <Navbar.Brand href='/'>Sensibus.io</Navbar.Brand>
      <Navbar.Collapse className='justify-content-end'>
        {renderLoginForm(loginBarState)}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default LoginBar
